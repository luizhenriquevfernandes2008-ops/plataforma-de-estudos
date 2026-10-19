const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

function validateConfig(value) {
  let url; try { url = new URL(value.url); } catch { throw Error('Informe a URL HTTPS do projeto Supabase.'); }
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) || url.port || url.username || url.password || !['', '/'].includes(url.pathname) || url.search || url.hash) throw Error('Use a URL do projeto, como https://seuprojeto.supabase.co.');
  const key = typeof value.key === 'string' ? value.key.trim() : '';
  let anonymous = false;
  try { anonymous = JSON.parse(Buffer.from(key.split('.')[1], 'base64url')).role === 'anon'; } catch {}
  if (!/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(key) && !anonymous) throw Error('Use somente a chave pública publishable ou anon. Nunca use service_role ou secret.');
  return {url: url.origin, key};
}
function credentials(email, password) {
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw Error('Informe um e-mail válido.');
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) throw Error('Use uma senha de 8 a 128 caracteres.');
  return {email: email.trim().toLowerCase(), password};
}
function createCloudAuth(directory, safeStorage, fetcher = fetch) {
  const configFile = path.join(directory, 'cloud-config.json');
  const sessionFile = path.join(directory, 'cloud-session.enc');
  let config = null, session = null, refreshing = null, offline = false;
  async function init() {
    try { config = validateConfig(JSON.parse(await fs.readFile(configFile, 'utf8'))); } catch {}
    if (!config || !safeStorage.isEncryptionAvailable()) return;
    try {
      const data = JSON.parse(safeStorage.decryptString(await fs.readFile(sessionFile)));
      if (data.project === config.url && validSession(data.session)) session = data.session;
    } catch {}
    if (session) { try { await token(); } catch { offline = !!session; } }
  }
  function validSession(s) { return s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string' && /^[a-f0-9-]{36}$/i.test(s.user?.id) && typeof s.user.email === 'string'; }
  async function persist() {
    if (!safeStorage.isEncryptionAvailable()) throw Error('O cofre do Windows não está disponível; não foi possível proteger a sessão.');
    await fs.mkdir(directory, {recursive: true});
    await fs.writeFile(sessionFile + '.tmp', safeStorage.encryptString(JSON.stringify({project: config.url, session})));
    await fs.rename(sessionFile + '.tmp', sessionFile);
  }
  async function request(route, body, bearer) {
    if (!config) throw Error('Conecte um projeto Supabase em Configurar nuvem.');
    let response;
    try { response = await fetcher(config.url + '/auth/v1' + route, {method: 'POST', redirect: 'error', headers: {apikey: config.key, 'Content-Type': 'application/json', ...(bearer ? {Authorization: 'Bearer ' + bearer} : {})}, body: JSON.stringify(body), signal: AbortSignal.timeout(15000)}); }
    catch { throw Error('Sem conexão com o serviço de contas. Seus dados locais foram preservados.'); }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = Error(response.status === 429 ? 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.' : data.code === 'email_not_confirmed' ? 'Confirme seu e-mail pelo link recebido antes de entrar.' : route.startsWith('/token') ? 'E-mail ou senha não conferem, ou a sessão expirou. Entre novamente.' : 'O serviço não aceitou a operação. Confira os dados, a confirmação de e-mail e a configuração do projeto.');
      error.status = response.status; throw error;
    }
    return data;
  }
  async function accept(data) {
    if (!validSession(data)) throw Error('Resposta de autenticação inválida.');
    session = {access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at || Math.floor(Date.now()/1000) + (data.expires_in || 3600), user: {id: data.user.id, email: data.user.email}};
    await persist(); offline = false; return publicStatus();
  }
  async function token() {
    if (!session) throw Error('Entre na sua conta para sincronizar.');
    if (session.expires_at > Date.now()/1000 + 90) return session.access_token;
    if (refreshing) return refreshing;
    refreshing = (async () => {
      try { await accept(await request('/token?grant_type=refresh_token', {refresh_token: session.refresh_token})); return session.access_token; }
      catch (e) { offline = true; if ([400,401,403].includes(e.status)) { session = null; await fs.unlink(sessionFile).catch(() => {}); } throw e; }
    })();
    try { return await refreshing; } finally { refreshing = null; }
  }
  function publicStatus() { return {configured: !!config, projectUrl: config?.url || '', user: session?.user || null, offline}; }
  async function configure(value) {
    if (session) throw Error('Saia da conta antes de trocar o projeto.');
    const next = validateConfig(value); await fs.mkdir(directory, {recursive: true});
    await fs.writeFile(configFile + '.tmp', JSON.stringify(next)); await fs.rename(configFile + '.tmp', configFile); config = next;
    return publicStatus();
  }
  async function signup(email, password) {
    const data = await request('/signup', credentials(email, password));
    if (data.access_token) return {...await accept(data), confirmationRequired: false};
    return {...publicStatus(), confirmationRequired: true};
  }
  async function login(email, password) { return accept(await request('/token?grant_type=password', credentials(email, password))); }
  async function resend(email) { credentials(email, 'validation-only'); await request('/resend', {type:'signup', email:email.trim().toLowerCase()}); return {ok:true}; }
  async function confirm(email,code) { credentials(email,'validation-only');if(typeof code!=='string'||!/^\d{6,10}$/.test(code))throw Error('Digite o código recebido no e-mail.');return accept(await request('/verify',{email:email.trim().toLowerCase(),token:code,type:'signup'})); }
  async function recover(email) { credentials(email, 'validation-only'); await request('/recover', {email:email.trim().toLowerCase()}); return {ok:true}; }
  async function resetPassword(email, code, password) {
    const input = credentials(email, password);
    if (typeof code !== 'string' || !/^\d{6,10}$/.test(code)) throw Error('Digite o código de recuperação recebido no e-mail.');
    const data = await request('/verify', {email:input.email, token:code, type:'recovery'});
    if (!validSession(data)) throw Error('Não foi possível validar o código.');
    const response = await fetcher(config.url+'/auth/v1/user', {method:'PUT',redirect:'error',headers:{apikey:config.key,Authorization:'Bearer '+data.access_token,'Content-Type':'application/json'},body:JSON.stringify({password}),signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw Error('Senha não alterada. Solicite outro código e tente novamente.');
    return accept(data);
  }
  async function logout() {
    if (session) { try { await request('/logout?scope=local', {}, session.access_token); } catch {} }
    session = null; offline = false; await fs.unlink(sessionFile).catch(e => {if(e.code!=='ENOENT')throw e;}); return publicStatus();
  }
  async function cloudRequest(route, options = {}) {
    const bearer = await token();
    let response; try { response = await fetcher(config.url+'/rest/v1/'+route, {...options,redirect:'error',headers:{apikey:config.key,Authorization:'Bearer '+bearer,'Content-Type':'application/json',...options.headers},signal:AbortSignal.timeout(15000)}); }
    catch { offline = true; throw Error('Sem conexão. O progresso continua salvo neste computador.'); }
    if (!response.ok) { offline = true; const e=Error([404,400].includes(response.status)?'Banco de dados ainda não configurado ou resposta incompatível. Execute o SQL de instalação do projeto.':response.status===409?'O progresso mudou em outro dispositivo. Sincronize novamente.':'Não foi possível sincronizar (HTTP '+response.status+'). O progresso local foi preservado.');e.status=response.status;throw e; }
    offline = false; return response.json();
  }
  function profileId() { if(!session||!config)return null;return crypto.createHash('sha256').update(config.url).digest('hex').slice(0,12)+'-'+session.user.id; }
  return {init,publicStatus,configure,signup,login,resend,confirm,recover,resetPassword,logout,cloudRequest,profileId};
}
module.exports={createCloudAuth,validateConfig,credentials};
