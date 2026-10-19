import type {Lesson} from './content';
import type {Question} from './questions';
export type Subject={id:string;name:string;short:string;questions:number;points:number;group?:'basic'|'specific'};
export type Resource={title:string;kind:string;subject:string;url:string;desc:string};
export type Course={id:'curitiba'|'bb-comercial'|'bb-tecnologia';name:string;role:string;short:string;status:string;examDate?:string;reference:string;description:string;accent:string;lessons:Lesson[];questions:Question[];subjects:Subject[];library:Resource[];weeks:string[][];fullCount:number;fullMinutes:number;official:string;exam:string;answerKey:string;edital:string;essay:boolean};
export type Records=Record<string,any>;
export const checkedDate='05/10/2026';
