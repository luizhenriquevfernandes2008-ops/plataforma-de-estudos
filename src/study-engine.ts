import type {Course} from './course-types';
import type {Question} from './questions';
export const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function shuffle<T>(items:T[]):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function makeExam(course:Course,full:boolean):Question[]{
 if(full)return course.subjects.flatMap(s=>shuffle(course.questions.filter(q=>q.subject===s.id)).slice(0,s.questions));
 const active=course.subjects.filter(s=>s.questions>0);const picked=active.map(s=>shuffle(course.questions.filter(q=>q.subject===s.id))[0]);
 const rest=shuffle(course.questions.filter(q=>!picked.some(p=>p.id===q.id)));return shuffle([...picked,...rest.slice(0,10-picked.length)]);
}
export function scoreExam(course:Course,qs:Question[],answers:Record<string,number>){
 const full=qs.length===course.fullCount;const correct=qs.filter(q=>answers[q.id]===q.correct).length;
 const rows=course.subjects.filter(s=>s.questions>0).map(s=>{const pool=qs.filter(q=>q.subject===s.id);const hit=pool.filter(q=>answers[q.id]===q.correct).length;return {...s,total:pool.length,hit,score:hit*s.points/s.questions};});
 const points=rows.reduce((n,s)=>n+s.score,0);const basic=rows.filter(s=>s.group==='basic').reduce((n,s)=>n+s.score,0);const specific=rows.filter(s=>s.group==='specific').reduce((n,s)=>n+s.score,0);
 return {correct,rows,points,basic,specific,full,percent:full?points:100*correct/qs.length,meets:full&&(course.essay?points>=50&&basic>=16.25&&specific>=33.75&&rows.every(s=>s.hit>0):points>=60)};
}
