const fs=require('node:fs/promises');const path=require('node:path');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function mergeSnapshots(base,local,remote,choices={}) {
  const merged={},conflicts=[];
  for(const scope of new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)])) {
    merged[scope]={};
    for(const key of new Set([...Object.keys(base[scope]||{}),...Object.keys(local[scope]||{}),...Object.keys(remote[scope]||{})])) {
      const b=base[scope]?.[key],l=local[scope]?.[key],r=remote[scope]?.[key],id=scope+'/'+key;let value;
      if(equal(l,r)||equal(r,b))value=l;
      else if(equal(l,b))value=r;
      else if(choices[id]==='local')value=l;
      else if(choices[id]==='remote')value=r;
      else {conflicts.push({id,scope,key,local:l,remote:r});value=l;}
      if(value!==undefined)merged[scope][key]=value;
    }
  }
  return {merged,conflicts};
}
function createCloudSync(directory,auth,stores,validators,hooks={}) {
  const file=path.join(directory,'sync-state.json');let state={base:{},lastSync:null},inflight=null,timer=null,error='',conflicts=[],pending=false,stopped=false;
  async function init(){try{const data=JSON.parse(await fs.readFile(file,'utf8'));validate(data.base);state=data;}catch{} }
  function validate(snapshot){if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))throw Error('Progresso remoto inválido.');for(const [scope,records]of Object.entries(snapshot)){if(!validators[scope])throw Error('Categoria remota desconhecida.');validators[scope](records);}return snapshot;}
  async function snapshot(){const result={};for(const [scope,store]of Object.entries(stores)){result[scope]={...await store.read()};if(scope==='central')delete result[scope]['settings:radar'];}return result;}
  async function status(){pending=!equal(await snapshot(),state.base);return {lastSync:state.lastSync,error,pending,syncing:!!inflight,conflicts};}
  async function sync(choices={}) {
    if(inflight)return inflight;
    const priorConflicts=conflicts;
    inflight=(async()=>{error='';try{
      const local=await snapshot();const rows=await auth.cloudRequest('pep_progress?select=revision,payload&limit=1');
      if(!Array.isArray(rows)||rows.length>1)throw Error('Resposta de sincronização inválida.');
      const row=rows[0]||{revision:0,payload:{}};if(!Number.isSafeInteger(row.revision)||row.revision<0)throw Error('Versão remota inválida.');validate(row.payload);
      const validChoices={};for(const c of priorConflicts)if(equal(c.local,local[c.scope]?.[c.key])&&equal(c.remote,row.payload[c.scope]?.[c.key])&&['local','remote'].includes(choices[c.id]))validChoices[c.id]=choices[c.id];
      const result=mergeSnapshots(state.base,local,row.payload,validChoices);conflicts=result.conflicts;
      if(conflicts.length){error='Há versões diferentes do mesmo registro. Escolha qual manter; ambas continuam disponíveis aqui.';return;}
      const incoming=!equal(result.merged,local);
      if(incoming&&hooks.canApply&&!await hooks.canApply()){error='Há dados novos na nuvem. Salve o texto ou conclua o simulado para recebê-los com segurança.';return;}
      validate(result.merged);if(JSON.stringify(result.merged).length>10000000)throw Error('O perfil ultrapassa 10 MB. Exporte um backup antes de continuar; a sincronização foi pausada.');
      if(!equal(result.merged,row.payload))await auth.cloudRequest('rpc/pep_save_progress',{method:'POST',body:JSON.stringify({p_expected:row.revision,p_payload:result.merged})});
      // Apply only fields that have not changed locally while the network was in use.
      for(const [scope,records]of Object.entries(result.merged)){const current=await stores[scope].read();const safe={};for(const [key,value]of Object.entries(records)){if(scope==='central'&&key==='settings:radar')continue;if(equal(current[key],local[scope]?.[key])&&!equal(current[key],value))safe[key]=value;}if(Object.keys(safe).length)await stores[scope].mergeIfUnchanged(safe,local[scope]||{});}
      state={base:result.merged,lastSync:new Date().toISOString()};await fs.mkdir(directory,{recursive:true});await fs.writeFile(file+'.tmp',JSON.stringify(state));await fs.rename(file+'.tmp',file);conflicts=[];
      if(incoming&&hooks.onApplied)await hooks.onApplied();
    }catch(e){error=e.message;}finally{pending=!equal(await snapshot(),state.base);}})();
    try{await inflight;}finally{inflight=null;}return status();
  }
  function start(){stopped=false;timer=setInterval(()=>{if(!stopped)sync().catch(()=>{});},60000);timer.unref();}
  async function stop(){stopped=true;clearInterval(timer);if(inflight)await inflight;}
  return {init,status,sync,start,stop};
}
module.exports={createCloudSync,mergeSnapshots};
