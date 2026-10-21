const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v));
const str=(v,n)=>typeof v==='string'&&v.length<=n;
function validateLearning(key,v){
 if(v.review!==undefined&&(!v.review||!date(v.review.due)||!date(v.review.lastDate)||!Number.isInteger(v.review.level)||v.review.level<0||v.review.level>5))throw Error('Agendamento de revisão inválido.');
 if(v.errorReason!==undefined&&!['','conteudo','interpretacao','atencao','calculo'].includes(v.errorReason))throw Error('Motivo de erro inválido.');
 if(key.startsWith('lesson:note-')&&(!str(v.title,150)||!str(v.text,12000)||!str(v.lesson,25)||!date(v.date)||typeof v.archived!=='boolean'))throw Error('Anotação inválida.');
 if(key.startsWith('lesson:flash-')&&(!str(v.front,1000)||!str(v.back,12000)||!str(v.lesson,25)||!date(v.date)||typeof v.archived!=='boolean'))throw Error('Cartão pessoal inválido.');
 if(key==='lesson:assessment'&&(!date(v.date)||!Array.isArray(v.ids)||v.ids.length>40||v.ids.some(id=>!/^q\d{1,4}$/.test(id))||!v.answers||typeof v.answers!=='object'||Array.isArray(v.answers)||Object.keys(v.answers).some(k=>!v.ids.includes(k))||Object.values(v.answers).some(n=>!Number.isInteger(n)||n<0||n>4)||!Array.isArray(v.subjects)||v.subjects.length>20||v.subjects.some(s=>!str(s.id,8)||!Number.isInteger(s.total)||s.total<1||s.total>40||!Number.isInteger(s.correct)||s.correct<0||s.correct>s.total)))throw Error('Diagnóstico por questões inválido.');
 if(key.startsWith('lesson:plan-')&&(!date(v.date)||![15,30,60].includes(v.minutes)))throw Error('Plano diário inválido.');
}
module.exports={validateLearning};
