const {app,BrowserWindow,protocol,shell,Menu,dialog,session,nativeTheme,safeStorage,Notification,Tray}=require('electron');
const fs=require('node:fs/promises');
const path=require('node:path');
const {createRecovery}=require('./recovery.cjs');
const {createStore,validate}=require('./store.cjs');
const {validateCentral}=require('./central-store.cjs');
const {createEssayService,localReview,validateDraft}=require('./essay-service.cjs');
const {createRadar,DEFAULT}=require('./radar.cjs');
const {createCloudAuth}=require('./cloud-auth.cjs');
const {createCloudSync}=require('./cloud-sync.cjs');
const {createUpdates}=require('./updater.cjs');
app.setName('PEPEstudos22');
app.setAppUserModelId('PEP.Estudos.22');
app.setPath('userData',(!app.isPackaged&&process.env.PEP_QA_DIR)||path.join(app.getPath('appData'),'PEP-Estudos-2.1'));
protocol.registerSchemesAsPrivileged([{scheme:'study',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true,stream:true}}]);
const ids=['curitiba','bb-comercial','bb-tecnologia'];
const baseDirectory=app.getPath('userData');
const auth=createCloudAuth(baseDirectory,safeStorage,fetch,require('./cloud-defaults.json'));
let recovery;
let stores,preferences,central,essays,radar,syncer=null,profile=null,profileDirectory=baseDirectory,switching=false,activeWrites=0,accountBusy=false;
function setStores(directory){recovery?.stop();profileDirectory=directory;stores=Object.fromEntries(ids.map(id=>[id,createStore(path.join(directory,id))]));preferences=createStore(path.join(directory,'preferencias'));central=createStore(path.join(directory,'central'),validateCentral);essays=createEssayService(directory,safeStorage);recovery=createRecovery(directory,{...stores,preferencias:preferences,central});}
setStores(baseDirectory);
async function accountStatus(){return {...auth.publicStatus(),profile,sync:syncer?await syncer.status():null};}
async function activate(guest=false){
 if(activeWrites)throw Error('Aguarde o salvamento terminar antes de trocar de conta.');
 switching=true;
 try{radar?.stop();await syncer?.stop();syncer=null;
 const user=auth.publicStatus().user;if(!guest&&!user)throw Error('Entre na sua conta.');
 profile=guest?{id:'local',email:null}:user;setStores(guest?baseDirectory:path.join(baseDirectory,'perfis',auth.profileId()));
 await fs.mkdir(baseDirectory,{recursive:true});await fs.writeFile(path.join(baseDirectory,'profile-choice.json'),JSON.stringify({guest}));
 if(!guest){const all={...stores,preferencias:preferences,central};syncer=createCloudSync(profileDirectory,auth,all,Object.fromEntries(Object.keys(all).map(k=>[k,k==='central'?validateCentral:validate])),{canApply:async()=>switching||!win||await win.webContents.executeJavaScript("!window.dispatchEvent?false:window.dispatchEvent(new Event('beforeunload',{cancelable:true}))"),onApplied:async()=>{if(!switching&&win)win.reload();}});await syncer.init();await syncer.sync();syncer.start();}
 await recovery.checkpoint("abertura");recovery.start();
 const owner=profile.id;radar=createRadar(profileDirectory,central,(...args)=>{if(profile?.id===owner&&!switching)notify(...args);});await radar.init();background=((await central.read())['settings:radar']||DEFAULT).background;if(!process.env.PEP_QA_DIR)radar.start();
 }finally{switching=false;}
 return accountStatus();
}
async function accountHandler(request){
 try{if(request.method==='GET')return json(await accountStatus());if(request.method!=='POST')return json({error:'Método inválido.'},405);
 const raw=await request.text();if(raw.length>20000)throw Error('Solicitação muito grande.');const p=JSON.parse(raw);
 if(switching)throw Error('Aguarde a troca de perfil.');
 if(p.action==='config')return json(await auth.configure(p));
 if(p.action==='guest')return json(await activate(true));
 if(p.action==='login'||p.action==='signup'||p.action==='reset'||p.action==='confirm'){
  if(profile&&profile.id!=='local')throw Error('Saia da conta atual primeiro.');
  const result=p.action==='login'?await auth.login(p.email,p.password):p.action==='signup'?await auth.signup(p.email,p.password):p.action==='confirm'?await auth.confirm(p.email,p.code):await auth.resetPassword(p.email,p.code,p.password);
  return json(result.user?await activate():result);
 }
 if(p.action==='resend')return json(await auth.resend(p.email));
 if(p.action==='recover')return json(await auth.recover(p.email));
 if(p.action==='sync'){if(!syncer)throw Error('Entre em uma conta para sincronizar.');await syncer.sync(p.choices||{});return json(await accountStatus());}
 if(p.action==='logout'){
  if(activeWrites)throw Error('Aguarde o salvamento terminar antes de sair.');switching=true;
  try{radar?.stop();await syncer?.stop();await auth.logout();await fs.unlink(path.join(baseDirectory,'profile-choice.json')).catch(e=>{if(e.code!=='ENOENT')throw e;});syncer=null;profile=null;setStores(baseDirectory);background=false;}finally{switching=false;}return json(await accountStatus());
 }
 throw Error('Operação de conta inválida.');
 }catch(e){return json({error:e.message||'Não foi possível acessar a conta.'},400);}
}
let background=true,quitting=false,tray;const notices=new Set();
function notify(title,body){if(process.env.PEP_QA_DIR||!Notification.isSupported())return;const n=new Notification({title,body,icon:path.join(__dirname,'icon.png')});notices.add(n);n.on('click',()=>{if(win){win.show();win.focus();win.webContents.executeJavaScript("window.dispatchEvent(new Event('pep-open-radar'))").catch(()=>{});}});n.on('close',()=>notices.delete(n));n.on('failed',()=>notices.delete(n));n.show();}

const root=path.join(__dirname,'renderer');
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.wav':'audio/wav'};
let win;
const updatesEnabled=app.isPackaged&&require('node:fs').existsSync(path.join(process.resourcesPath,'app-update.yml'))&&require('node:fs').existsSync(path.join(path.dirname(process.execPath),'Uninstall PEP.exe'));
const updates=createUpdates(updatesEnabled?require('electron-updater').autoUpdater:null,{version:require('./package.json').version,enabled:updatesEnabled,canRestart:async()=>{
 if(activeWrites||accountBusy||switching||(syncer&&(await syncer.status()).syncing))return false;
 return !win||win.isDestroyed()||await win.webContents.executeJavaScript("window.dispatchEvent(new Event('beforeunload',{cancelable:true}))");
},quit:()=>app.quit()});
function showUpdates(){if(win&&!win.isDestroyed()){win.show();win.focus();win.webContents.executeJavaScript("window.dispatchEvent(new Event('pep-open-updates'))").catch(()=>{});}}
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
function external(url){try{const u=new URL(url);if(u.protocol==='https:'&&!u.username&&!u.password)shell.openExternal(u.href);}catch{}}
async function handler(request){
 const route=new URL(request.url).pathname;
 if(new URL(request.url).hostname!=='app')return json({error:'Endereço inválido.'},403);
 if(route==='/api/updates'){
  try{if(request.method==='GET')return json(updates.status());if(request.method!=='POST')return json({error:'Método inválido.'},405);const raw=await request.text();if(raw.length>1000)return json({error:'Solicitação inválida.'},413);const {action}=JSON.parse(raw);if(action==='check')return json(await updates.check());if(action==='install')return json(await updates.install());throw Error('Operação inválida.');}catch(e){return json({error:e.message},400);}
 }
 if(route==='/api/account'){if(request.method==='GET')return accountHandler(request);if(accountBusy)return json({error:'Aguarde a operação de conta terminar.'},409);accountBusy=true;try{return await accountHandler(request);}finally{accountBusy=false;}}
 if(route.startsWith('/api/')&&route!=='/api/window'&&(!profile||switching))return json({error:'Entre em uma conta ou abra o perfil local.'},401);
 const writing=request.method==='POST';if(writing)activeWrites++;
 try{return await routeHandler(request);}finally{if(writing)activeWrites--;}
}
async function routeHandler(request){
 const u=new URL(request.url);if(u.hostname!=='app')return json({error:'Endereço inválido.'},403);
 if(u.pathname==='/api/recovery'){
  try{if(request.method==='GET')return json({backups:await recovery.list(),error:recovery.error()});if(request.method!=='POST')throw Error('Método inválido.');const raw=await request.text();if(raw.length>1000)throw Error('Solicitação muito grande.');const p=JSON.parse(raw);if(p.action==='preview')return json(await recovery.preview(p.id));if(p.action==='snapshot'){await recovery.checkpoint('manual');return json({ok:true});}if(p.action==='restore')return json(await recovery.restore(p.id,p.scope,p.key));throw Error('Operação inválida.');}catch(e){return json({error:e.message},400);}
 }
 if(['/api/central','/api/writing/review','/api/groq/config','/api/radar','/api/window'].includes(u.pathname)){
  try{
   let payload={};if(request.method==='POST'){const raw=await request.text();if(raw.length>220000)return json({error:'Conteúdo muito grande.'},413);payload=JSON.parse(raw);}else if(request.method!=='GET')return json({error:'Método inválido.'},405);
   if(u.pathname==='/api/window'){if(request.method==='POST'){if(payload.action==='fullscreen')win.setFullScreen(!win.isFullScreen());else if(payload.action==='minimize')win.minimize();}return json({fullscreen:win.isFullScreen()});}
   if(u.pathname==='/api/central'){
    if(request.method==='GET')return json({records:await central.read()});validateCentral({[payload.key]:payload.value});
    if(payload.key==='settings:radar'&&payload.value.startAtLogin!==((await central.read())['settings:radar']||DEFAULT).startAtLogin){if(!app.isPackaged)throw Error('Iniciar com o Windows está disponível no aplicativo empacotado.');app.setLoginItemSettings({openAtLogin:payload.value.startAtLogin,path:process.execPath,args:['--background']});}
    if(payload.key.startsWith('draft:'))await recovery.checkpoint('antes-de-editar-texto');await central.save(payload.key,payload.value);if(payload.key==='settings:radar')background=payload.value.background;return json({ok:true});
   }
   if(u.pathname==='/api/groq/config'){if(request.method==='GET')return json(await essays.config());return json(payload.remove?await essays.remove():await essays.configure(payload.key));}
   if(u.pathname==='/api/writing/review'){if(request.method!=='POST')return json({error:'Envie a redação para corrigir.'},405);validateDraft(payload.draft);if(!/^draft:[a-zA-Z0-9-]{1,60}$/.test(payload.draftId))throw Error('Identificador de redação inválido.');if(!['local','groq'].includes(payload.kind))throw Error('Tipo de correção inválido.');await central.save(payload.draftId,{...payload.draft,updatedAt:new Date().toISOString(),archived:false});const result=payload.kind==='groq'?await essays.assess(payload.draft,payload.model):localReview(payload.draft);const key='review:'+require('node:crypto').randomUUID();const value={draftId:payload.draftId,draft:payload.draft,result};await central.save(key,value);return json({key,value});}
   if(u.pathname==='/api/radar'){if(request.method==='POST'&&payload.action==='check')return json(await radar.check(true));if(request.method==='POST'&&payload.action==='read')return json(await radar.markRead());if(request.method==='POST'&&payload.action==='test'){notify('PEP · aviso de teste','Os próximos prazos e novas publicações aparecerão aqui.');return json({ok:true,supported:Notification.isSupported()});}return json(await radar.status());}
  }catch(e){return json({error:e.message||'Não foi possível concluir a operação.'},400);}
 }
 if(['/api/study','/api/preferences'].includes(u.pathname)){
  const pref=u.pathname==='/api/preferences';const selected=pref?preferences:stores[u.searchParams.get('course')];
  if(!selected)return json({error:'Curso inválido.'},400);
  try{
   if(request.method==='GET'){let diagnosticNeeded=false;if(!pref){try{await fs.access(path.join(path.dirname(selected.file),'diagnostic-seen.json'));}catch{diagnosticNeeded=true;}}return json({records:await selected.read(),diagnosticNeeded});}
   if(request.method!=='POST')return json({error:'Método inválido.'},405);
   const raw=await request.text();if(raw.length>72000)return json({error:'Registro muito grande.'},413);
   const {key,value}=JSON.parse(raw);if(pref&&!['settings:theme','settings:sound'].includes(key))return json({error:'Preferência inválida.'},400);
   validate({[key]:value});if(key==='note'||key==='essay'||key.startsWith('lesson:note-')||key.startsWith('lesson:flash-'))await recovery.checkpoint('antes-de-editar-texto');await selected.save(key,value);
   if(!pref&&key==='lesson:diagnostic')await fs.writeFile(path.join(path.dirname(selected.file),'diagnostic-seen.json'),JSON.stringify({completed:true}));
   if(pref&&key==='settings:theme'){nativeTheme.themeSource=value.mode;win?.setBackgroundColor(value.mode==='dark'?'#111923':'#f4f5f7');}
   return json({ok:true});
  }catch(e){return json({error:e.message||'Não foi possível salvar.'},503);}
 }
 if(request.method!=='GET')return json({error:'Método inválido.'},405);
 try{
  const file=path.resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))return json({error:'Acesso negado.'},403);
  let content=await fs.readFile(file);
  if(path.extname(file)==='.html'){let mode='light';try{mode=(await preferences.read())['settings:theme']?.mode==='dark'?'dark':'light';}catch{}nativeTheme.themeSource=mode;content=Buffer.from(content.toString('utf8').replace('<html lang="pt-BR">','<html lang="pt-BR" data-theme="'+mode+'">'));}
  return new Response(content,{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Security-Policy':csp}});
 }catch{return json({error:'Arquivo não encontrado.'},404);}
}
async function backup(){try{
 if(!profile)throw Error('Abra uma conta ou o perfil local antes de exportar.');
 const result=await dialog.showSaveDialog(win,{title:'Backup de todos os cursos',defaultPath:path.join(app.getPath('documents'),'PEP-backup-'+new Date().toISOString().slice(0,10)+'.json'),filters:[{name:'Backup PEP',extensions:['json']}]});if(result.canceled)return;
 const courses=Object.fromEntries(await Promise.all(ids.map(async id=>[id,await stores[id].read()])));
 await fs.writeFile(result.filePath,JSON.stringify({app:'PEP',version:4,account:profile,preferences:await preferences.read(),courses,central:await central.read()},null,2));
 await dialog.showMessageBox(win,{message:'Backup completo salvo.',detail:'Inclui cursos, central de redações, correções e agenda. A chave Groq fica protegida no Windows e não entra no backup.'});
}catch(e){dialog.showErrorBox('Backup não salvo',e.message);}}
async function restore(){try{
 if(!profile)throw Error('Abra a conta de destino ou o perfil local antes de importar.');
 const result=await dialog.showOpenDialog(win,{title:'Restaurar backup PEP ou Prefeitura',properties:['openFile'],filters:[{name:'Backup',extensions:['json']}]});if(result.canceled)return;
 const data=JSON.parse(await fs.readFile(result.filePaths[0],'utf8'));const incoming=[2,3,4].includes(data.version)&&data.courses?data.courses:{curitiba:data.records||data};
 const incomingCentral=validateCentral(data.central||{});
 if(incomingCentral['settings:radar'])incomingCentral['settings:radar'].startAtLogin=((await central.read())['settings:radar']||DEFAULT).startAtLogin;
 for(const [id,records]of Object.entries(incoming)){if(!ids.includes(id))throw new Error('Curso desconhecido no backup.');validate(records);}
 const prefs=validate(data.preferences||{});if(Object.keys(prefs).some(k=>!['settings:theme','settings:sound'].includes(k)))throw new Error('Preferências inválidas.');
 const answer=await dialog.showMessageBox(win,{type:'question',buttons:['Cancelar','Restaurar'],defaultId:0,cancelId:0,message:'Restaurar os registros deste backup?',detail:'Registros correspondentes serão substituídos; os demais serão mantidos. Salve suas anotações e conclua o simulado antes de restaurar. Backups antigos entram somente em Curitiba.'});if(answer.response!==1)return;
 for(const [id,records]of Object.entries(incoming))await stores[id].merge(records);
 await preferences.merge(prefs);await central.merge(incomingCentral);background=((await central.read())['settings:radar']||DEFAULT).background;win.reload();
}catch(e){dialog.showErrorBox('Backup não restaurado',e.message);}}
async function importLegacy(){
 if(process.env.PEP_QA_DIR)return;
 try{await fs.access(stores.curitiba.file);return;}catch(e){if(e.code!=='ENOENT')return;}
 try{const records=validate(JSON.parse(await fs.readFile(path.join(app.getPath('appData'),'RumoAPrefeitura','progresso.json'),'utf8')));await stores.curitiba.merge(records);const prefs=await preferences.read();if(records['settings:theme']&&!prefs['settings:theme'])await preferences.save('settings:theme',records['settings:theme']);}catch(e){if(e.code!=='ENOENT')dialog.showErrorBox('Progresso antigo preservado','Não foi possível copiar automaticamente. A versão antiga permanece intacta. Você pode importar um backup pelo menu Arquivo.');}
}
async function importPrevious(){
 if(process.env.PEP_QA_DIR)return;
 for(const id of [...ids,'preferencias']){const target=id==='preferencias'?preferences:stores[id];try{await fs.access(target.file);continue;}catch(e){if(e.code!=='ENOENT')continue;}try{const records=validate(JSON.parse(await fs.readFile(path.join(app.getPath('appData'),'PEP-Estudos-Teste',id,'progresso.json'),'utf8')));await target.merge(records);}catch(e){if(e.code!=='ENOENT')dialog.showErrorBox('Dados anteriores preservados','Não foi possível copiar '+id+'. A versão 2.0 continua intacta; restaure um backup pelo menu Arquivo.');}}
}
function createTray(){try{tray=new Tray(path.join(__dirname,'icon.ico'));tray.setToolTip('PEP · Radar de concursos');tray.on('double-click',()=>{win.show();win.focus();});tray.setContextMenu(Menu.buildFromTemplate([{label:'Abrir PEP',click:()=>{win.show();win.focus();}},{label:'Atualizações da PEP',click:showUpdates},{label:'Verificar publicações agora',click:()=>radar?.check(true).catch(()=>{})},{label:'Sair completamente',click:()=>{quitting=true;app.quit();}}]));}catch{background=false;}}
function createWindow(){
 const hidden=process.argv.includes('--background');
 win=new BrowserWindow({width:1380,height:940,minWidth:940,minHeight:680,fullscreen:true,show:!hidden,autoHideMenuBar:true,title:'PEP · Plataforma de Estudos',backgroundColor:'#111923',icon:path.join(__dirname,'icon.ico'),webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,spellcheck:false,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required'}});
 win.on('close',event=>{if(!quitting&&background){event.preventDefault();win.hide();}});
 win.on('query-session-end',()=>updates.sessionEnding());
 win.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&(input.key==='F11'||input.key==='Escape'&&win.isFullScreen())){event.preventDefault();win.setFullScreen(!win.isFullScreen());}});
 win.webContents.setWindowOpenHandler(({url})=>{external(url);return{action:'deny'};});
 win.webContents.on('will-navigate',(event,url)=>{const u=new URL(url);if(u.protocol!=='study:'||u.hostname!=='app'){event.preventDefault();external(url);}});
 win.webContents.on('will-prevent-unload',event=>{const answer=dialog.showMessageBoxSync(win,{type:'question',buttons:['Continuar estudando','Sair sem salvar'],defaultId:0,cancelId:0,message:'Há alterações não salvas ou um simulado em andamento.',detail:'Volte para salvar seu trabalho antes de sair.'});if(answer===1)event.preventDefault();else {quitting=false;updates.cancelRestart();}});
 win.loadURL('study://app/'+(hidden?'?background=1':''));
 Menu.setApplicationMenu(Menu.buildFromTemplate([
 {label:'Arquivo',submenu:[{label:'Salvar backup de todos os cursos…',accelerator:'CmdOrCtrl+Shift+S',click:backup},{label:'Restaurar backup…',click:restore},{label:'Pasta do progresso',click:()=>shell.openPath(profileDirectory)},{type:'separator'},{label:'Imprimir página…',accelerator:'CmdOrCtrl+P',click:()=>win.webContents.print({printBackground:true})},{label:'Sair',role:'quit'}]},
 {label:'Editar',submenu:[{label:'Desfazer',role:'undo'},{label:'Refazer',role:'redo'},{type:'separator'},{label:'Recortar',role:'cut'},{label:'Copiar',role:'copy'},{label:'Colar',role:'paste'},{label:'Selecionar tudo',role:'selectAll'}]},
 {label:'Exibir',submenu:[{label:'Recarregar',role:'reload'},{label:'Tamanho original',role:'resetZoom'},{label:'Aumentar',role:'zoomIn'},{label:'Diminuir',role:'zoomOut'},{label:'Tela inteira',role:'togglefullscreen'}]},
 {label:'Ajuda',submenu:[{label:'Atualizações da PEP',click:showUpdates},{label:'Como estudar',click:()=>dialog.showMessageBox(win,{message:'Uma hora por dia.',detail:'10 min de revisão, 25 min de aula, 20 min de questões e 5 min de caderno. Escolha uma trilha por sessão. O progresso dos cursos é separado.\n\nConteúdo e progresso funcionam offline. Fontes e livros externos precisam de internet. Salve um backup semanal pelo menu Arquivo.'})},{label:'Sobre PEP',click:()=>dialog.showMessageBox(win,{message:'PEP · 2.5.0 · Versão de testes',detail:'Curitiba: Agente Administrativo. Banco do Brasil: Agente Comercial e Agente de Tecnologia.\n\nBB usa edital histórico 2022/001, prova 2023. Radar de publicações oficiais e central de redações com Groq. Aulas-guia e questões autorais de apoio, sem vínculo com órgãos ou bancas. Não há garantia de aprovação.'})}]}
 ]));
}
if(!app.requestSingleInstanceLock())app.quit();else{
 app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
 app.whenReady().then(async()=>{await importPrevious();await importLegacy();await auth.init();if(auth.publicStatus().user)await activate();else {let local=false;try{local=JSON.parse(await fs.readFile(path.join(baseDirectory,'profile-choice.json'),'utf8')).guest===true;}catch{}if(local||process.env.PEP_QA_GUEST&&!app.isPackaged)await activate(true);else background=false;}protocol.handle('study',handler);session.defaultSession.setPermissionRequestHandler((_c,_p,cb)=>cb(false));createWindow();createTray();updates.start();});
 app.on('before-quit',event=>{if(activeWrites||accountBusy||switching){event.preventDefault();quitting=false;updates.cancelRestart();dialog.showMessageBox(win,{message:'Aguarde o salvamento terminar antes de sair.'});return;}quitting=true;});
 app.on('quit',()=>updates.onQuit());
 app.on('will-quit',()=>{updates.stop();radar?.stop();syncer?.stop();});
 app.on('window-all-closed',()=>{if(!background||quitting)app.quit();});
}
