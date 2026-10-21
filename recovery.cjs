const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
function createRecovery(directory,stores){
 const folder=path.join(directory,'backups-automaticos');let queue=Promise.resolve(),lastHash='',timer=null,lastError='';
 const validId=id=>typeof id==='string'&&/^\d{13}-[a-f0-9]{8}\.json$/.test(id);
 async function read(id){if(!validId(id))throw Error('Backup inválido.');return JSON.parse(await fs.readFile(path.join(folder,id),'utf8'));}
 async function list(){let names;try{names=await fs.readdir(folder);}catch(e){if(e.code==='ENOENT')return [];throw e;}const rows=[];for(const id of names.filter(validId).sort().reverse()){try{const data=await read(id);rows.push({id,createdAt:data.createdAt,reason:data.reason,records:Object.values(data.scopes).reduce((n,r)=>n+Object.keys(r).length,0)});}catch{}}return rows;}
 function checkpoint(reason='periodico'){const job=queue.then(async()=>{const scopes=Object.fromEntries(await Promise.all(Object.entries(stores).map(async([id,s])=>[id,await s.read()]))),hash=crypto.createHash('sha256').update(JSON.stringify(scopes)).digest('hex');if(hash===lastHash)return;await fs.mkdir(folder,{recursive:true});const id=Date.now()+'-'+crypto.randomBytes(4).toString('hex')+'.json';await fs.writeFile(path.join(folder,id),JSON.stringify({version:1,createdAt:new Date().toISOString(),reason,scopes}));lastHash=hash;lastError='';const rows=await list(),keep=new Set(rows.slice(0,5).map(r=>r.id)),buckets=new Set();for(const row of [...rows].reverse()){const bucket=Math.floor(Date.parse(row.createdAt)/600000);if(!buckets.has(bucket)){buckets.add(bucket);keep.add(row.id);}}const retained=new Set([...keep].sort().reverse().slice(0,20));for(const old of rows)if(!retained.has(old.id))await fs.unlink(path.join(folder,old.id));});queue=job.catch(e=>{lastError=e.message;});return job;}
 async function preview(id){await queue;return read(id);}
 async function restore(id,scope,key){if(!Object.hasOwn(stores,scope))throw Error('Área inválida.');const data=await preview(id);if(!Object.hasOwn(data.scopes[scope]||{},key))throw Error('Registro não encontrado.');await checkpoint('antes-de-recuperar');await stores[scope].save(key,data.scopes[scope][key]);return {ok:true};}
 function start(){timer=setInterval(()=>checkpoint().catch(()=>{}),20*60*1000);timer.unref?.();}
 function stop(){clearInterval(timer);}
 return {error:()=>lastError,list,preview,restore,checkpoint,start,stop};
}
module.exports={createRecovery};
