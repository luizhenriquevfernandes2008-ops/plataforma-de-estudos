const fs=require('node:fs/promises');const path=require('node:path');const crypto=require('node:crypto');
const SOURCES=[
 {id:'curitiba',name:'Curitiba · publicações do Edital 4/2026',url:'https://concursos.curitiba.pr.gov.br/documento/00/0/2026/4/19/1/1',description:'Editais, anexos, retificações e convocações publicados nesta página.'},
 {id:'novos',name:'Curitiba · oportunidades',url:'https://concursos.curitiba.pr.gov.br/listar/1/0',description:'Lista oficial de concursos. A existência de uma publicação não significa inscrição aberta.'},
 {id:'bb',name:'Banco do Brasil · notícias de concursos',url:'https://imprensa.bb.com.br/category/institucionais/concursos-bb/',feed:'https://imprensa.api.search.bb.com.br/blogbb/v2/search?taxonomy=category&terms_taxonomy=Concursos+BB&post_type=post&page=1&per_page=20',description:'Categoria Concursos BB na imprensa oficial. Uma notícia não confirma novo edital; leia a publicação.'},
 {id:'enem',name:'ENEM · notícias oficiais',url:'https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/enem',description:'Publicações do Inep sobre o exame, documentos e etapas.'},
 {id:'federal',name:'Governo Federal · autorizações',url:'https://www.gov.br/gestao/pt-br/acesso-a-informacao/servidores/concursos-publicos/autorizacoes-e-provimentos',description:'Autorizações e documentos do MGI. Autorização não equivale à abertura de inscrições.'}
];
const DEFAULT={enabled:true,notifications:true,background:true,startAtLogin:false,sources:['curitiba','novos','bb']};
const SEED_EVENTS=[
 ...[
 ['cur-isencao-resultado','Resultado preliminar da isenção','2026-10-20'],
 ['cur-isencao-recurso','Último dia de recurso da isenção','2026-10-22'],
 ['cur-inscricao-resultado','Resultado preliminar das inscrições','2026-11-17'],
 ['cur-inscricao-recurso','Último dia de recurso da inscrição','2026-11-19'],
 ['cur-inscricao-homologacao','Homologação das inscrições','2026-11-26'],
 ['cur-convocacao','Publicação prevista de local e horário','2026-12-03'],
 ['cur-gabarito','Gabarito preliminar e caderno de questões','2026-12-14'],
 ['cur-gabarito-recurso','Último dia de recurso do gabarito','2026-12-16'],
 ['cur-resultado','Resultado preliminar da prova objetiva','2027-01-06'],
 ['cur-resultado-recurso','Último dia de recurso do resultado da prova','2027-01-08'],
 ['cur-resultado-definitivo','Resultado definitivo da prova objetiva','2027-01-14'],
 ['cur-classificacao','Resultado final e classificação previstos','2027-02-16'],
 ['cur-classificacao-recurso','Último dia de recurso da classificação','2027-02-18'],
 ['cur-homologacao','Homologação final prevista','2027-02-25']
 ].map(([id,title,day])=>({id,title,course:'Curitiba',due:day+'T12:00:00-03:00',note:'Data prevista no cronograma do edital retificado, conferido em 19/10/2026. Lembrete às 12h; confira na banca o horário real e se a etapa se aplica a você.',url:'https://concursos.curitiba.pr.gov.br/documento/00/0/2026/4/19/1/1'})),
 {id:'cur-inscricao',course:'Curitiba',title:'Abertura das inscrições',due:'2026-10-07T08:00:00-03:00',note:'Crie ou confira seu cadastro e faça a inscrição na banca. Prazo confirmado em 19/10/2026.',url:'https://fafipa.selecao.net.br/concurso/4209-concurso-publico-do-municipio-de-curitiba-pr-medio'},
 {id:'cur-isencao',course:'Curitiba',title:'Fim do pedido de isenção',due:'2026-10-13T12:00:00-03:00',note:'Lembrete às 12h, não horário oficial de encerramento. Confira requisitos e horário no edital. Solicitar não equivale a obter isenção.',url:'https://concursos.curitiba.pr.gov.br/documento/00/0/2026/4/19/1/1'},
 {id:'cur-fim',course:'Curitiba',title:'Encerramento das inscrições',due:'2026-11-05T23:59:00-03:00',note:'Confira a situação da inscrição e os dados informados. Referência conferida em 19/10/2026.',url:'https://fafipa.selecao.net.br/concurso/4209-concurso-publico-do-municipio-de-curitiba-pr-medio'},
 {id:'cur-pagamento',course:'Curitiba',title:'Data-limite para pagamento',due:'2026-11-06T12:00:00-03:00',note:'Lembrete às 12h, não horário oficial de encerramento. Consulte o boleto e o horário bancário aplicável.',url:'https://fafipa.selecao.net.br/concurso/4209-concurso-publico-do-municipio-de-curitiba-pr-medio'},
 {id:'cur-local',course:'Curitiba',title:'Conferir local e convocação da prova',due:'2026-12-10T12:00:00-03:00',note:'Lembrete pessoal de preparação, não data oficial de publicação da convocação.',url:'https://fafipa.selecao.net.br/concurso/4209-concurso-publico-do-municipio-de-curitiba-pr-medio'},
 {id:'cur-prova',course:'Curitiba',title:'Prova objetiva prevista',due:'2026-12-13T00:00:00-03:00',note:'Data prevista no cronograma. O horário desta agenda indica apenas o dia; consulte a convocação para portões, local e horário real.',url:'https://concursos.curitiba.pr.gov.br/documento/00/0/2026/4/19/1/1'}
];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,24);
function decode(s){return s.replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>{const v=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return v>0&&v<=0x10ffff?String.fromCodePoint(v):'';}).replace(/&(amp|quot|apos|nbsp|lt|gt|ndash|mdash|aacute|eacute|iacute|oacute|uacute|atilde|otilde|ccedil);/gi,(_,n)=>({amp:'&',quot:'"',apos:"'",nbsp:' ',lt:'<',gt:'>',ndash:'–',mdash:'—',aacute:'á',eacute:'é',iacute:'í',oacute:'ó',uacute:'ú',atilde:'ã',otilde:'õ',ccedil:'ç'}[n.toLowerCase()]||''));}
function extractLinks(html,source){const clean=html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,'');const result=[];for(const match of clean.matchAll(/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi)){const attr=match[1].match(/\bhref\s*=\s*(["'])(.*?)\1/i);if(!attr)continue;const title=decode(match[2].replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();if(title.length<5||title.length>500)continue;let u;try{u=new URL(decode(attr[2]),source.url);}catch{continue;}if(u.protocol!=='https:'||u.username||u.password)continue;u.hash='';const topic=/concurso|edital|anexo|inscri|convoca|autoriza|provimento|sele[çc][aã]o|enem|resultado|gabarito/i.test(title);
 const allowed=source.id==='curitiba'?u.hostname==='mid-rh.curitiba.pr.gov.br'&&u.pathname.includes('/Arquivo/Concurso/'):
 source.id==='novos'?u.hostname==='concursos.curitiba.pr.gov.br'&&u.pathname.startsWith('/documento/'):
 source.id==='bb'?u.hostname==='imprensa.bb.com.br'&&u.pathname.split('/').filter(Boolean).length===1&&topic:
 source.id==='enem'?u.hostname==='www.gov.br'&&u.pathname.includes('/noticias/enem/'):
 source.id==='federal'?u.hostname==='www.gov.br'&&topic&&/\.(xlsx|pdf)$/i.test(u.pathname):false;
 if(!allowed)continue;const id=hash(u.href+'|'+title);if(!result.some(r=>r.id===id))result.push({id,title:title.slice(0,250),url:u.href});if(result.length>=60)break;}
 return result;
}
function extractBBFeed(text){let data;try{data=JSON.parse(text);}catch{throw Error('Resposta inválida da fonte BB');}if(!Array.isArray(data.data))throw Error('Formato da fonte BB mudou');return data.data.slice(0,60).flatMap(post=>{if(typeof post.titulo!=='string'||typeof post.link!=='string')return[];const title=decode(post.titulo.replace(/<[^>]*>/g,'')).trim().slice(0,250);let u;try{u=new URL(post.link,'https://imprensa.bb.com.br/');}catch{return [];}if(u.protocol!=='https:'||u.hostname!=='imprensa.bb.com.br'||u.username||u.password||!title)return[];return[{id:hash(u.href+'|'+title),title,url:u.href}];});}
function relevantEvents(events,now=Date.now()){return events.filter(e=>!e.done&&!e.archived&&Number.isFinite(Date.parse(e.due))&&Date.parse(e.due)>=now-86400000&&Date.parse(e.due)<=now+7*86400000).sort((a,b)=>Date.parse(a.due)-Date.parse(b.due));}
function createRadar(directory,central,notify,fetcher=fetch){const file=path.join(directory,'radar-cache.json');let cache={sources:{},alerts:[],notified:{}};let inflight=null;let timer,initialTimer;let writes=Promise.resolve();
 async function init(){try{const read=JSON.parse(await fs.readFile(file,'utf8'));if(read&&read.sources&&Array.isArray(read.alerts)&&read.notified)cache=read;}catch{}const records=await central.read();for(const e of SEED_EVENTS)if(!records['event:'+e.id])await central.save('event:'+e.id,{...e,done:false,archived:false});if(!records['settings:radar'])await central.save('settings:radar',DEFAULT);}
 const persist=()=>{const snapshot=JSON.stringify(cache);const job=writes.then(async()=>{await fs.mkdir(directory,{recursive:true});await fs.writeFile(file+'.tmp',snapshot);await fs.rename(file+'.tmp',file);});writes=job.catch(()=>{});return job;};
 async function status(){const records=await central.read();return {sources:SOURCES.map(s=>({...s,...cache.sources[s.id]})),alerts:cache.alerts,settings:records['settings:radar']||DEFAULT};}
 async function check(force=false){if(inflight)return inflight;inflight=(async()=>{const r=await central.read(),settings=r['settings:radar']||DEFAULT;if(!settings.enabled&&!force)return status();
 for(const source of SOURCES.filter(s=>settings.sources.includes(s.id))){const previous=cache.sources[source.id]||{};if(Date.now()-Date.parse(previous.attemptedAt||0)<(force?60000:6*3600000))continue;const attemptedAt=new Date().toISOString();
  try{const response=await fetcher(source.feed||source.url,{headers:{'User-Agent':'PEP-Estudos/2.1 (verificacao de publicacoes publicas)'},signal:AbortSignal.timeout(18000),redirect:'follow'});if(!response.ok)throw Error('HTTP '+response.status);const finalUrl=new URL(response.url||source.url);if(!['www.gov.br','concursos.curitiba.pr.gov.br','imprensa.bb.com.br','imprensa.api.search.bb.com.br'].includes(finalUrl.hostname))throw Error('Redirecionamento inesperado');const html=await response.text();if(html.length>5000000)throw Error('Página acima do limite');const items=source.id==='bb'?extractBBFeed(html):extractLinks(html,source);if(!items.length)throw Error('Nenhuma publicação identificável; consulte a página manualmente');const seen=new Set(previous.seen||[]);const added=previous.checkedAt?items.filter(item=>!seen.has(item.id)):[];
   cache.sources[source.id]={items,seen:[...new Set([...(previous.seen||[]),...items.map(i=>i.id)])].slice(-1500),attemptedAt,checkedAt:attemptedAt,error:null};
   for(const item of added.slice(0,10)){const alert={...item,id:source.id+'-'+item.id,source:source.id,detectedAt:attemptedAt,read:false};if(!cache.alerts.some(a=>a.id===alert.id))cache.alerts.unshift(alert);}
   if(added.length&&settings.notifications)notify('Nova publicação · '+source.name,`${added.length} item(ns) detectado(s). Confira a fonte no Radar da PEP.`);
  }catch(e){cache.sources[source.id]={...previous,attemptedAt,error:e.name==='TimeoutError'?'A fonte demorou a responder.':e.message==='fetch failed'?'Não foi possível conectar à fonte.':e.message};}
 }
 cache.alerts=cache.alerts.slice(0,100);await reminders();await persist();return status();})();try{return await inflight;}finally{inflight=null;}}
 async function reminders(){const r=await central.read(),s=r['settings:radar']||DEFAULT;if(!s.enabled||!s.notifications)return;const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());const events=Object.entries(r).filter(([k])=>k.startsWith('event:')).map(([id,e])=>({...e,id})).filter(e=>e.course!=='Curitiba'||s.sources.includes('curitiba'));const due=relevantEvents(events).filter(e=>cache.notified[e.id]!==date);if(due.length){notify('PEP · próximos prazos',due.slice(0,3).map(e=>`${e.title}: ${new Date(e.due).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'})}`).join('\n'));for(const e of due)cache.notified[e.id]=date;}}
 async function markRead(){cache.alerts=cache.alerts.map(a=>({...a,read:true}));await persist();return status();}
 function start(){stop();timer=setInterval(()=>check().catch(()=>{}),15*60000);timer.unref();initialTimer=setTimeout(()=>check().catch(()=>{}),7000);initialTimer.unref();}
 function stop(){clearInterval(timer);clearTimeout(initialTimer);}
 return {init,status,check,markRead,start,stop};
}
module.exports={SOURCES,DEFAULT,SEED_EVENTS,extractLinks,extractBBFeed,relevantEvents,createRadar};
