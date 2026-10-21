const {test}=require('node:test'),assert=require('node:assert/strict'),ts=require('typescript'),fs=require('node:fs'),fsp=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {normalizeAppearance,defaults}=require('../src/preferences.ts'),{motivation}=require('../src/motivation-engine.ts'),{courses}=require('../src/courses.ts'),{validate,createStore}=require('../store.cjs');
test('old appearance records keep their mode; malformed preferences cannot inject styles',()=>{
 assert.deepEqual(normalizeAppearance({mode:'dark'}),{...defaults,mode:'dark'});assert.equal(normalizeAppearance({font:'url(evil)'}).font,'system');
 for(const bad of [{palette:'invalid'},{font:'external-font'},{textSize:'1000px'},{dopamine:'false'},{reducedMotion:1}])assert.throws(()=>validate({'settings:theme':{...defaults,...bad}}));
 validate({'settings:theme':{mode:'dark'}});validate({'settings:theme':{...defaults,palette:'rose',dopamine:false,font:'georgia'}});
});
test('appearance and quiet mode persist independently in each account profile',async()=>{
 const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'pep-preferences-')),a=createStore(path.join(dir,'a/preferencias')),b=createStore(path.join(dir,'b/preferencias'));
 await a.save('settings:theme',{...defaults,palette:'rose',font:'verdana',dopamine:false});await b.save('settings:theme',{...defaults,palette:'ocean'});
 assert.equal((await createStore(path.join(dir,'a/preferencias')).read())['settings:theme'].dopamine,false);assert.equal((await b.read())['settings:theme'].palette,'ocean');
});
test('XP rewards distinct work, not repeated answers or same-day exam farming',()=>{
 const c=courses[0],day='2026-10-21',r={};let m=motivation(c,r,day);assert.equal(m.xp,0);
 r['answer:'+c.questions[0].id]={selected:0,correct:false,date:day};assert.equal(motivation(c,r,day).xp,5);
 r['answer:'+c.questions[0].id]={selected:1,correct:true,date:day};assert.equal(motivation(c,r,day).xp,5);
 r['lesson:'+c.lessons[0].id]={done:true,date:day};r['lesson:diagnostic']={done:true};r['card:'+c.lessons[0].id]={date:day,level:1,due:day};r['session:'+day]={minutes:60};r['sim:1']={date:day};r['sim:2']={date:day};
 m=motivation(c,r,day);assert.equal(m.xp,63);assert.equal(m.daily[1].done,1);assert.equal(m.daily[2].done,1);assert.equal(m.badges.filter(b=>b.earned).length,2);
 assert.equal(motivation(c,r,'2026-10-22').xp,63);assert.ok(motivation(c,r,'2026-10-22').daily.every(d=>d.done===0));assert.equal(motivation(c,{},day).xp,0);
});
