import type {Course,Records} from './course-types';
export type Diagnostic={done:true;version:1;minutes:number;levels:Record<string,number>;weakLessons:string[];difficulties:string[];updatedAt:string};
export const diagnosticKey='lesson:diagnostic';
export function priorities(course:Course,records:Records){
 const profile=records[diagnosticKey] as Diagnostic|undefined;
 return course.lessons.map((lesson,order)=>{
  const practiced=course.questions.filter(q=>q.lesson===lesson.id&&records['answer:'+q.id]);
  const errors=practiced.filter(q=>records['answer:'+q.id].correct===false).length;
  const level=profile?.levels[lesson.subject]??1;
  const weak=profile?.weakLessons.includes(lesson.id)||false;
  const completed=!!records['lesson:'+lesson.id]?.done;
  const subject=course.subjects.find(s=>s.id===lesson.subject);
  const measured=records['lesson:assessment']?.subjects?.find((s:any)=>s.id===lesson.subject);
  const score=(measured?.total?40*(1-measured.correct/measured.total):0)+(3-level)*12+(weak?30:0)+(errors?25+35*errors/practiced.length:0)+(completed?0:8)+(subject?.points||0)/10;
  const reasons=[measured?.total?`Diagnóstico: ${measured.correct}/${measured.total} nesta matéria`:'',errors?`${errors} erro(s) em ${practiced.length} questão(ões) praticada(s)`:'',weak?'Você marcou este assunto como difícil':'',level<2?'Base informada: '+(level===0?'começando agora':'iniciante'):'',!completed?'Aula ainda não concluída':''].filter(Boolean);
  return {lesson,score,reasons,errors,practiced:practiced.length,completed,order};
 }).sort((a,b)=>b.score-a.score||a.order-b.order);
}
export function targetedQuestions(course:Course,records:Records,count=10){
 const ranks=new Map(priorities(course,records).map((x,i)=>[x.lesson.id,i]));
 return [...course.questions].sort((a,b)=>{
  const priority=(id:string)=>records['answer:'+id]?.correct===false?0:records['answer:'+id]?2:1;
  return priority(a.id)-priority(b.id)||(ranks.get(a.lesson)??999)-(ranks.get(b.lesson)??999)||a.id.localeCompare(b.id,undefined,{numeric:true});
 }).slice(0,count);
}
export function sessionPlan(minutes:number){const review=Math.round(minutes/6),practice=Math.round(minutes/3),notes=Math.max(3,Math.round(minutes/12));return {review,lesson:minutes-review-practice-notes,practice,notes};}
