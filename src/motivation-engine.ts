import type {Course,Records} from './course-types';
export function motivation(c:Course,r:Records,date:string){
 const answers=c.questions.filter(q=>r['answer:'+q.id]),lessons=c.lessons.filter(l=>r['lesson:'+l.id]?.done),cards=c.lessons.filter(l=>r['card:'+l.id]);
 const examDays=new Set(Object.entries(r).filter(([k])=>k.startsWith('sim:')).map(([,v])=>v.date));
 const sessions=Object.entries(r).filter(([k,v])=>k.startsWith('session:')&&v.minutes>0);
 const xp=answers.length*5+lessons.length*20+cards.length*3+examDays.size*20+sessions.length*15;
 const daily=[{label:'Pratique 5 questões',done:answers.filter(q=>r['answer:'+q.id].date===date).length,target:5,tab:'Questões'},{label:'Conclua 1 aula',done:lessons.filter(l=>r['lesson:'+l.id].date===date).length,target:1,tab:'Matérias e aulas'},{label:'Revise 1 cartão',done:cards.filter(l=>r['card:'+l.id].date===date).length,target:1,tab:'Memorizar'}];
 const badges=[{name:'Primeiro passo',earned:answers.length>=1,detail:'Pratique sua primeira questão'},{name:'Em movimento',earned:answers.length>=10,detail:'Pratique 10 questões diferentes'},{name:'Base firme',earned:lessons.length>=5,detail:'Conclua 5 aulas'},{name:'Memória ativa',earned:cards.length>=10,detail:'Revise 10 cartões diferentes'},{name:'Ensaio de prova',earned:examDays.size>=1,detail:'Conclua um simulado'}];
 return {xp,level:Math.floor(xp/100)+1,progress:xp%100,daily,badges};
}
