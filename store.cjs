const fs = require('node:fs/promises');
const path = require('node:path');
const validKey = /^(note|settings:theme|lesson:[epmil]\d{2}|answer:q\d{1,3}|card:[epmil]\d{2}|session:\d{4}-\d{2}-\d{2}|sim:[a-zA-Z0-9-]{1,50})$/;
function validate(records) {
  if (!records || typeof records !== 'object' || Array.isArray(records)) throw new Error('Arquivo de progresso inválido.');
  for (const [key, value] of Object.entries(records)) {
    if (!validKey.test(key) || value === null || typeof value !== 'object' || Array.isArray(value) || JSON.stringify(value).length > 30000) throw new Error('Registro de progresso inválido.');
    const finite=n=>typeof n==='number'&&Number.isFinite(n);
    const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d));
    const valid=key==='settings:theme'?['light','dark'].includes(value.mode):key==='note'?typeof value.text==='string'&&value.text.length<=20000:
      key.startsWith('lesson:')?typeof value.done==='boolean':
      key.startsWith('answer:')?typeof value.correct==='boolean'&&Number.isInteger(value.selected)&&value.selected>=0&&value.selected<5:
      key.startsWith('card:')?date(value.due)&&Number.isInteger(value.level)&&value.level>=0&&value.level<=4:
      key.startsWith('session:')?finite(value.minutes)&&value.minutes>=0&&value.minutes<=480:
      key.startsWith('sim:')?date(value.date)&&finite(value.count)&&value.count>0&&value.count<=40&&finite(value.correct)&&value.correct>=0&&value.correct<=value.count&&finite(value.percent)&&value.percent>=0&&value.percent<=100:false;
    if(!valid)throw new Error('Conteúdo inválido no registro '+key+'.');
  }
  return records;
}
function createStore(directory) {
  const file = path.join(directory, 'progresso.json');
  let queue = Promise.resolve();
  async function read() {
    try { return validate(JSON.parse(await fs.readFile(file, 'utf8'))); }
    catch (e) { if (e.code === 'ENOENT') return {}; throw new Error('Não foi possível ler o progresso. O arquivo foi preservado. Use Arquivo → Pasta do progresso para verificar o backup.'); }
  }
  function write(transform) {
    const job = queue.then(async () => {
      const previous = await read();
      const next = validate(transform(previous));
      await fs.mkdir(directory, {recursive:true});
      await fs.writeFile(file + '.tmp', JSON.stringify(next, null, 2), 'utf8');
      try { await fs.copyFile(file, file + '.bak'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
      await fs.rename(file + '.tmp', file);
      return next;
    });
    queue = job.catch(() => {});
    return job;
  }
  return {file, read:async()=>{await queue;return read();}, save:(key,value)=>write(records=>({...records,[key]:value})), merge:records=>write(previous=>({...previous,...validate(records)}))};
}
module.exports = {createStore,validate};
