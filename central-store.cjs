const {validateDraft,validateAiResponse}=require('./essay-service.cjs');
const SOURCES=['curitiba','novos','bb','enem','federal'];
const string=(v,n)=>typeof v==='string'&&v.length<=n;
const iso=v=>string(v,40)&&Number.isFinite(Date.parse(v));
function validateCentral(records){if(!records||typeof records!=='object'||Array.isArray(records))throw Error('Backup da central inválido.');for(const [key,v]of Object.entries(records)){
 if(!v||typeof v!=='object'||Array.isArray(v)||JSON.stringify(v).length>200000)throw Error('Registro inválido na central.');
 if(/^draft:[a-zA-Z0-9-]{1,60}$/.test(key)){validateDraft(v);if(!iso(v.updatedAt)||typeof v.archived!=='boolean')throw Error('Rascunho inválido.');}
 else if(/^review:[a-zA-Z0-9-]{1,60}$/.test(key)){if(!string(v.draftId,70)||!v.result)throw Error('Correção inválida.');validateDraft(v.draft);if(v.result.kind==='groq')validateAiResponse(v.result,v.draft);else if(v.result.kind!=='local'||!Array.isArray(v.result.issues)||!Array.isArray(v.result.feedback)||!Number.isInteger(v.result.words)||v.result.issues.some(i=>!string(i.quote,2000)||!string(i.suggestion,2000)||!string(i.reason,2000)))throw Error('Revisão local inválida.');}
 else if(key==='settings:radar'){if(['enabled','notifications','background','startAtLogin'].some(k=>typeof v[k]!=='boolean')||!Array.isArray(v.sources)||v.sources.some(id=>!SOURCES.includes(id)))throw Error('Preferências do radar inválidas.');}
 else if(/^event:[a-zA-Z0-9-]{1,60}$/.test(key)){if(!string(v.title,200)||!v.title.trim()||!string(v.course,100)||!string(v.note,1000)||!iso(v.due)||typeof v.done!=='boolean'||typeof v.archived!=='boolean'||!string(v.url,1000)||v.url&&!/^https:\/\//.test(v.url))throw Error('Prazo inválido.');}
 else if(/^step:[a-zA-Z0-9-]{1,60}$/.test(key)){if(typeof v.done!=='boolean')throw Error('Etapa inválida.');}
 else throw Error('Registro desconhecido na central: '+key);
 }return records;}
module.exports={validateCentral,SOURCES};
