const {test}=require('node:test');const assert=require('node:assert/strict');const ts=require('typescript');const fs=require('node:fs');
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);
const {courses}=require('../src/courses.ts');const {makeExam,scoreExam}=require('../src/study-engine.ts');
for(const c of courses){
 test(c.id+': lesson links, unique IDs and complete exam distribution',()=>{
  assert.equal(new Set(c.lessons.map(l=>l.id)).size,c.lessons.length);assert.equal(new Set(c.questions.map(q=>q.id)).size,c.questions.length);
  for(const q of c.questions){assert.ok(c.lessons.some(l=>l.id===q.lesson),'Missing lesson '+q.lesson);assert.equal(q.options.length,5);assert.ok(q.correct>=0&&q.correct<5);assert.ok(q.explanation.length>20);assert.equal(new Set(q.options).size,5);}
  for(const l of c.lessons){assert.ok(l.body.length>=2);assert.ok(l.source.startsWith('https://'));}
  for(const w of c.weeks)for(const id of w.slice(3))assert.ok(c.lessons.some(l=>l.id===id));
  if(c.essay)for(const l of c.lessons)assert.ok(c.weeks.some(w=>w.slice(3).includes(l.id)),'Lesson missing from cycle: '+l.id);
  const qs=makeExam(c,true);assert.equal(qs.length,c.fullCount);assert.equal(new Set(qs.map(q=>q.id)).size,c.fullCount);for(const s of c.subjects)assert.equal(qs.filter(q=>q.subject===s.id).length,s.questions);
  const perfect=Object.fromEntries(qs.map(q=>[q.id,q.correct]));assert.equal(scoreExam(c,qs,perfect).points,100);assert.equal(scoreExam(c,qs,perfect).meets,true);assert.equal(scoreExam(c,qs,{}).meets,false);assert.equal(scoreExam(c,qs,{}).points,0);assert.equal(makeExam(c,false).length,10);
  if(c.essay){const zeroEnglish=Object.fromEntries(qs.filter(q=>q.subject!=='eng').map(q=>[q.id,q.correct]));assert.equal(scoreExam(c,qs,zeroEnglish).points,95);assert.equal(scoreExam(c,qs,zeroEnglish).meets,false);}
  console.log(c.id,c.lessons.length,'lessons',c.questions.length,'questions',c.library.length,'resources');
 });
}
test('course stores isolate shared question IDs, essays and settings survive reload',async()=>{
 const fsp=require('node:fs/promises'),path=require('node:path'),os=require('node:os');const {createStore}=require('../store.cjs');const root=await fsp.mkdtemp(path.join(os.tmpdir(),'pep-isolation-'));
 const a=createStore(path.join(root,'bb-comercial')),b=createStore(path.join(root,'bb-tecnologia'));
 await a.save('answer:q1',{selected:1,correct:true});await b.save('answer:q1',{selected:0,correct:false});await b.save('essay',{text:'Minha redação.',topic:'Tema'});await b.save('settings:sound',{enabled:false});
 assert.equal((await createStore(path.join(root,'bb-comercial')).read())['answer:q1'].correct,true);assert.equal((await b.read())['answer:q1'].correct,false);assert.equal((await a.read()).essay,undefined);assert.equal((await createStore(path.join(root,'bb-tecnologia')).read()).essay.text,'Minha redação.');
 await b.save('sim:70',{date:'2026-10-05',count:70,correct:70,percent:100});assert.equal((await b.read())['sim:70'].count,70);
});
