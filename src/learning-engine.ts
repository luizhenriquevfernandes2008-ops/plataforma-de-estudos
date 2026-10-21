import {summaryUnits} from './apostila-content';
import type {Course,Records} from './course-types';
import type {Question} from './questions';
import {shuffle,today} from './study-engine';
import {priorities,sessionPlan} from './personal-engine';
export type SaveRecord=(key:string,value:any)=>Promise<boolean>;
export const reasons=[['conteudo','Faltou conteúdo'],['interpretacao','Interpretação'],['atencao','Distração'],['calculo','Cálculo']] as const;
export function addDays(date:string,days:number){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function schedule(previous:any,good:boolean,date=today()) {const level=good?Math.min(5,(previous?.level??-1)+1):0;return {level,due:addDays(date,[1,3,7,14,30,60][level]),lastDate:date};}
export function enrichRecord(key:string,value:any,previous:any,date=today()){
 if(key.startsWith('answer:')&&value.date&&(!previous||previous.date!==value.date||previous.selected!==value.selected||!value.review)&&!value.reviewRecorded)return {...value,review:schedule(previous?.review,value.correct,date),errorReason:value.correct?'':value.errorReason||previous?.errorReason||'',attempts:Math.min(100000,(previous?.attempts||0)+1)};
 if(/^lesson:[a-z]{1,4}\d+$/.test(key)&&value.done&&!previous?.done&&!value.review)return {...value,review:schedule(previous?.review,true,date)};
 return value;
}
export function reviewQueue(c:Course,r:Records,date=today()){
 const rows:{key:string;kind:'question'|'lesson'|'custom';title:string;due:string;question?:Question;lesson?:Course['lessons'][number];value:any}[]=[];
 for(const q of c.questions){const v=r['answer:'+q.id];if(v)rows.push({key:'answer:'+q.id,kind:'question',title:q.text,due:v.review?.due||(v.date?addDays(v.date,1):date),question:q,value:v});}
 for(const l of c.lessons){const v=r['lesson:'+l.id];if(v?.done)rows.push({key:'lesson:'+l.id,kind:'lesson',title:l.recall,due:v.review?.due||addDays(v.date||date,1),lesson:l,value:v});}
 for(const [key,v]of Object.entries(r))if(key.startsWith('lesson:flash-')&&!v.archived)rows.push({key,kind:'custom',title:v.front,due:v.review?.due||date,value:v});
 return rows.sort((a,b)=>a.due.localeCompare(b.due)||a.key.localeCompare(b.key));
}
export function diagnosticQuestions(c:Course){return c.subjects.filter(s=>s.questions>0).flatMap(s=>shuffle(c.questions.filter(q=>q.subject===s.id)).slice(0,2));}
export function assessment(c:Course,qs:Question[],answers:Record<string,number>){return {done:true,date:today(),ids:qs.map(q=>q.id),answers,subjects:c.subjects.filter(s=>s.questions>0).map(s=>{const pool=qs.filter(q=>q.subject===s.id);return {id:s.id,total:pool.length,correct:pool.filter(q=>answers[q.id]===q.correct).length};})};}
export function errorGroups(c:Course,r:Records){return c.subjects.map(s=>{const qs=c.questions.filter(q=>q.subject===s.id&&r['answer:'+q.id]?.correct===false);return {subject:s,questions:qs,reasons:reasons.map(([id,label])=>({id,label,count:qs.filter(q=>r['answer:'+q.id].errorReason===id).length}))};}).filter(x=>x.questions.length);}
export function flexiblePlan(c:Course,r:Records,minutes:number,date=today()) {const ranked=priorities(c,r);return {minutes,...sessionPlan(minutes),targetLesson:ranked.find(x=>!x.completed)?.lesson||ranked[0]?.lesson,reviewKeys:reviewQueue(c,r,date).filter(x=>x.due<=date).slice(0,Math.max(1,Math.floor(minutes/10))).map(x=>x.key),questionCount:Math.max(2,Math.floor(sessionPlan(minutes).practice/2))};}
export function examAnalysis(c:Course,qs:Question[],answers:Record<string,number>,seconds:Record<string,number>){return c.subjects.filter(s=>qs.some(q=>q.subject===s.id)).map(s=>{const pool=qs.filter(q=>q.subject===s.id),wrong=pool.filter(q=>answers[q.id]!==q.correct);return {subject:s,total:pool.length,correct:pool.length-wrong.length,seconds:pool.reduce((n,q)=>n+(seconds[q.id]||0),0),lessons:[...new Set(wrong.map(q=>q.lesson))].map(id=>c.lessons.find(l=>l.id===id)!).filter(Boolean)};}).sort((a,b)=>(a.correct/a.total)-(b.correct/b.total));}
export function normalizeText(text:string){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export type SearchResult={course?:string;type:string;title:string;excerpt:string;tab?:string;lesson?:string;query?:string;draft?:string};
export function searchAll(cs:Course[],records:Record<string,Records>,central:Records,query:string){const terms=normalizeText(query).trim().split(/\s+/).filter(Boolean);if(!terms.length)return [];const list:SearchResult[]=[];
 for(const c of cs){if(c.id==='curitiba')for(const u of summaryUnits)list.push({course:c.id,type:'Apostila resumida',title:u.title,excerpt:[...u.points,u.answer,u.example].join(' '),tab:'Apostila resumida'});for(const l of c.lessons)list.push({course:c.id,type:'Aula e resumo',title:l.title,excerpt:[l.scope,...l.body,l.answer,l.example].join(' '),tab:'Matérias e aulas',lesson:l.id});for(const q of c.questions)list.push({course:c.id,type:'Questão',title:q.text,excerpt:q.explanation,tab:'Questões',query:q.text});for(const [key,v]of Object.entries(records[c.id]||{})){if(key==='note'||key.startsWith('lesson:note-')&&!v.archived)list.push({course:c.id,type:'Anotação',title:v.title||'Caderno de '+c.short,excerpt:v.text||'',tab:'Anotações e cartões'});if(key.startsWith('lesson:flash-')&&!v.archived)list.push({course:c.id,type:'Cartão pessoal',title:v.front,excerpt:v.back,tab:'Anotações e cartões'});}for(const res of c.library)list.push({course:c.id,type:'Material',title:res.title,excerpt:res.desc,tab:'Livros e fontes'});}
 for(const [key,v]of Object.entries(central))if(key.startsWith('draft:')&&!v.archived)list.push({type:'Redação',title:v.title,excerpt:[v.topic,v.text].join(' '),draft:key});
 return list.filter(x=>terms.every(t=>normalizeText(x.title+' '+x.excerpt).includes(t))).slice(0,100);
}
