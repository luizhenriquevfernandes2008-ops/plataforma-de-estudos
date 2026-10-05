const {app,BrowserWindow,protocol,shell,Menu,dialog,session,nativeTheme} = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const {createStore,validate} = require('./store.cjs');
app.setName('RumoAPrefeitura');
app.setPath('userData', (!app.isPackaged && process.env.RUMO_QA_DIR) || path.join(app.getPath('appData'), 'RumoAPrefeitura'));
protocol.registerSchemesAsPrivileged([{scheme:'study',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
const store = createStore(app.getPath('userData'));
const root = path.join(__dirname,'renderer');
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'};
let win;
function external(url) {
  try { const u=new URL(url); if(u.protocol==='https:' && !u.username && !u.password) shell.openExternal(u.href); } catch {}
}
function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});}
async function handler(request) {
  const url = new URL(request.url);
  if(url.hostname !== 'app') return new Response('Endereço inválido',{status:403});
  if(url.pathname === '/api/study') {
    try {
      if(request.method === 'GET') return json({records:await store.read()});
      if(request.method !== 'POST') return json({error:'Método inválido.'},405);
      const raw=await request.text();
      if(raw.length>30000) return json({error:'Registro muito grande.'},413);
      const {key,value}=JSON.parse(raw);
      validate({[key]:value});
      await store.save(key,value);
      if(key==='settings:theme'){nativeTheme.themeSource=value.mode;win?.setBackgroundColor(value.mode==='dark'?'#111a16':'#f5f7f5');}
      return json({ok:true});
    } catch(e) {return json({error:e.message || 'Não foi possível salvar o progresso.'},503);}
  }
  if(request.method!=='GET') return new Response('Método inválido',{status:405});
  try {
    const file=path.resolve(root, '.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!file.startsWith(root+path.sep)) return new Response('Acesso negado',{status:403});
    let content=await fs.readFile(file);
    if(path.extname(file)==='.html'){
      let mode='light';try{mode=(await store.read())['settings:theme']?.mode==='dark'?'dark':'light';}catch{}
      nativeTheme.themeSource=mode;
      content=Buffer.from(content.toString('utf8').replace('<html lang="pt-BR">','<html lang="pt-BR" data-theme="'+mode+'">'));
    }
    return new Response(content,{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Security-Policy':csp}});
  } catch {return new Response('Arquivo não encontrado',{status:404});}
}
async function backup(){
  try {const result=await dialog.showSaveDialog(win,{title:'Salvar backup do estudo',defaultPath:path.join(app.getPath('documents'),'curitiba-progresso-'+new Date().toISOString().slice(0,10)+'.json'),filters:[{name:'Backup do progresso',extensions:['json']}]});if(result.canceled)return;await fs.writeFile(result.filePath,JSON.stringify({app:'Rumo à Prefeitura',version:1,records:await store.read()},null,2));await dialog.showMessageBox(win,{type:'info',message:'Backup salvo.',detail:'Guarde uma cópia em outro lugar para proteger seus estudos.'});}catch(e){dialog.showErrorBox('Backup não salvo',e.message);}
}
async function restore(){
  try {const result=await dialog.showOpenDialog(win,{title:'Restaurar backup',properties:['openFile'],filters:[{name:'Backup do progresso',extensions:['json']}]});if(result.canceled)return;const data=JSON.parse(await fs.readFile(result.filePaths[0],'utf8'));const records=validate(data.records||data);const confirm=await dialog.showMessageBox(win,{type:'question',buttons:['Cancelar','Restaurar'],defaultId:0,cancelId:0,message:'Restaurar este backup?',detail:'Os registros do backup substituirão os registros correspondentes. Os demais serão mantidos. Salve antes as anotações que estiverem abertas.'});if(confirm.response!==1)return;await store.merge(records);win.reload();}catch(e){dialog.showErrorBox('Não foi possível restaurar',e.message);}
}
function createWindow(){
  win = new BrowserWindow({width:1360,height:920,minWidth:900,minHeight:640,title:'Rumo à Prefeitura · Curitiba',backgroundColor:'#f5f7f5',icon:path.join(__dirname,'icon.ico'),show:true,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,spellcheck:false}});
  const log=message=>fs.appendFile(path.join(app.getPath('userData'),'diagnostico.log'),new Date().toISOString()+' '+message+'\n').catch(()=>{});
  win.webContents.on('console-message',(_event,details)=>log('renderer: '+JSON.stringify(details)));
  win.webContents.on('did-fail-load',(_event,code,message)=>log('load failed: '+code+' '+message));
  win.webContents.on('did-finish-load',()=>log('Interface carregada.'));
  win.webContents.setWindowOpenHandler(({url})=>{external(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(event,url)=>{const u=new URL(url);if(u.protocol!=='study:'||u.hostname!=='app'){event.preventDefault();external(url);}});
  win.webContents.on('will-prevent-unload',event=>{const answer=dialog.showMessageBoxSync(win,{type:'question',buttons:['Continuar estudando','Sair sem salvar'],defaultId:0,cancelId:0,message:'Há anotações não salvas ou um simulado em andamento.',detail:'Volte para salvar suas anotações ou concluir o simulado antes de sair.'});if(answer===1)event.preventDefault();});
  win.once('ready-to-show',()=>win.show());
  win.loadURL('study://app/');
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {label:'Arquivo',submenu:[{label:'Salvar backup…',accelerator:'CmdOrCtrl+Shift+S',click:backup},{label:'Restaurar backup…',click:restore},{label:'Pasta do progresso',click:()=>shell.openPath(app.getPath('userData'))},{type:'separator'},{label:'Imprimir página…',accelerator:'CmdOrCtrl+P',click:()=>win.webContents.print({printBackground:true})},{type:'separator'},{label:'Sair',role:'quit'}]},
    {label:'Editar',submenu:[{label:'Desfazer',role:'undo'},{label:'Refazer',role:'redo'},{type:'separator'},{label:'Recortar',role:'cut'},{label:'Copiar',role:'copy'},{label:'Colar',role:'paste'},{label:'Selecionar tudo',role:'selectAll'}]},
    {label:'Exibir',submenu:[{label:'Recarregar',role:'reload'},{label:'Tamanho original',role:'resetZoom'},{label:'Aumentar',role:'zoomIn'},{label:'Diminuir',role:'zoomOut'},{label:'Tela inteira',role:'togglefullscreen'}]},
    {label:'Ajuda',submenu:[{label:'Como estudar',click:()=>dialog.showMessageBox(win,{type:'info',message:'Uma hora por dia, com constância.',detail:'Comece por Meu estudo. Reserve 10 min para revisão, 25 min para a aula, 20 min para questões e 5 min para o caderno. Use Arquivo → Salvar backup semanalmente.\n\nAulas, questões e progresso funcionam sem internet. Livros, editais e provas externas abrem no navegador.\n\nMaterial autoral de apoio, baseado no Edital 4/2026. Consulte retificações na banca. A preparação não garante aprovação.'})},{label:'Sobre o aplicativo',click:()=>dialog.showMessageBox(win,{type:'info',message:'Rumo à Prefeitura · Curitiba',detail:'Versão 1.1.0 • Windows\nAgente Administrativo • Plano de 1 hora por dia\n40 aulas de apoio • 80 questões autorais comentadas\nFontes verificadas em 05/10/2026.\nAplicativo pessoal, sem vínculo com a Prefeitura ou com a banca.'})}]}
  ]));
}
if(!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
  app.whenReady().then(()=>{protocol.handle('study',handler);session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));createWindow();});
  app.on('window-all-closed',()=>app.quit());
}
