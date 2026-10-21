import type {Question} from './questions';
export default function AnswerFeedback({question:q,selected}:{question:Question;selected?:number}){
 const correct=selected===q.correct;
 return <div className={correct?'answer-good':'answer-wrong'}><b>{correct?'Você acertou!':selected===undefined?'Questão não respondida':'Entenda o erro'}</b>{selected!==undefined&&!correct&&<p><strong>Você marcou {'ABCDE'[selected]}:</strong> {q.options[selected]}</p>}{!correct&&selected!==undefined&&q.optionExplanations?.[selected]&&<p><strong>Por que está errada:</strong> {q.optionExplanations[selected]}</p>}<p><strong>Resposta correta: {'ABCDE'[q.correct]}.</strong> {q.options[q.correct]}</p><p><strong>{correct||q.optionExplanations?.[selected??-1]?'Por que está correta:':'Por que essa é a resposta e a outra não atende ao enunciado:'}</strong> {q.explanation}</p></div>;
}
