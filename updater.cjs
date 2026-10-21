// This controller never accepts an update URL or executable path from the UI.
// electron-updater uses the GitHub feed embedded by electron-builder and checks
// the downloaded installer's SHA-512 against the release manifest.
function createUpdates(updater, {version, enabled, canRestart, quit, now = Date.now, timers = globalThis}) {
  let state = {enabled, currentVersion:version, phase:enabled?'idle':'disabled', nextVersion:'', percent:0, lastChecked:null, error:''};
  let checking=null, installing=false, restartRequested=false, firstTimer=null, interval=null, lastAttempt=null;
  function status(){return {...state};}
  if (enabled) {
    updater.autoDownload=true;
    updater.autoInstallOnAppQuit=true;
    updater.allowPrerelease=false;
    updater.allowDowngrade=false;
    updater.disableWebInstaller=true;
    updater.on('checking-for-update',()=>{state={...state,phase:'checking',error:''};});
    updater.on('update-available',info=>{state={...state,phase:'downloading',nextVersion:info.version,percent:0,error:''};});
    updater.on('download-progress',info=>{state={...state,phase:'downloading',percent:Math.max(0,Math.min(100,Number(info.percent)||0))};});
    updater.on('update-not-available',()=>{state={...state,phase:'current',nextVersion:'',percent:0,error:''};});
    updater.on('update-downloaded',info=>{state={...state,phase:'ready',nextVersion:info.version,percent:100,error:''};});
    updater.on('error',()=>{state={...state,phase:'error',error:'Não foi possível atualizar agora. Seus estudos continuam disponíveis. Tente novamente mais tarde.'};});
  }
  async function check(){
    if(!enabled||checking||['downloading','ready'].includes(state.phase))return status();
    if(lastAttempt!==null&&now()-lastAttempt<60000)return status();
    lastAttempt=now();state={...state,phase:'checking',error:'',lastChecked:new Date(now()).toISOString()};
    checking=(async()=>{try{const result=await updater.checkForUpdates();result?.downloadPromise?.catch(()=>{});}catch{state={...state,phase:'error',error:'Sem acesso às atualizações. Você pode continuar estudando e tentar novamente depois.'};}})();
    try{await checking;}finally{checking=null;}return status();
  }
  async function install(){
    if(!enabled||state.phase!=='ready')throw Error('Aguarde uma atualização terminar de baixar.');
    if(installing)return status();
    installing=true;
    try {
      if(!await canRestart())throw Error('Salve seu texto, conclua o simulado e aguarde os salvamentos antes de atualizar.');
      restartRequested=true;
      // Quit normally first. The installer must not start until every window has
      // closed successfully, including Electron's beforeunload protection.
      quit();return status();
    }finally{installing=false;}
  }
  function onQuit(){if(enabled&&restartRequested&&state.phase==='ready')updater.quitAndInstall(true,true);}
  function cancelRestart(){restartRequested=false;}
  function sessionEnding(){restartRequested=false;if(enabled)updater.autoInstallOnAppQuit=false;}
  function start(){if(!enabled||interval)return;firstTimer=timers.setTimeout(()=>check(),20000);firstTimer.unref?.();interval=timers.setInterval(()=>check(),4*60*60*1000);interval.unref?.();}
  function stop(){timers.clearTimeout(firstTimer);timers.clearInterval(interval);firstTimer=null;interval=null;}
  return {status,check,install,onQuit,cancelRestart,sessionEnding,start,stop};
}
module.exports={createUpdates};
