import {lessons,subjects,library,weeks,sources} from './content';
import {questions} from './questions';
import {bbLessons} from './bb-lessons';
import {bbQuestions} from './bb-questions';
import {bbSources as S} from './bb-sources';
import type {Course,Subject,Resource} from './course-types';
const basic:Subject[]=[
 {id:'por',name:'Língua Portuguesa',short:'Português',questions:10,points:15,group:'basic'},
 {id:'eng',name:'Língua Inglesa',short:'Inglês',questions:5,points:5,group:'basic'},
 {id:'mat',name:'Matemática',short:'Matemática',questions:5,points:7.5,group:'basic'},
 {id:'atu',name:'Atualidades do Mercado Financeiro',short:'Mercado financeiro',questions:5,points:5,group:'basic'}];
const sub=(id:string,name:string,q:number,p:number):Subject=>({id,name,short:name,questions:q,points:p,group:'specific'});
const resource=(title:string,subject:string,url:string,desc:string,kind='Fonte oficial · leitura complementar'):Resource=>({title,subject,url,desc,kind});
const shared:Resource[]=[
 resource('Edital 2022/001 e programa completo','all',S.edital,'Referência histórica. Confira o Anexo III; um novo edital pode alterar programa e regras.'),
 resource('Caderno de Educação Financeira','ban',S.money,'Livro gratuito do Banco Central: orçamento, crédito, consumo e planejamento.','Livro gratuito · Banco Central'),
 resource('Sistema Financeiro Nacional','ban',S.bcb,'Papéis dos órgãos normativos, supervisores e operadores.'),
 resource('Pix','atu',S.pix,'Funcionamento do arranjo de pagamentos instantâneos e orientações oficiais.'),
 resource('Open Finance','atu',S.open,'Consentimento, compartilhamento e dúvidas frequentes.'),
 resource('Ética e integridade do BB','ban',S.ethics,'Código de ética e materiais oficiais. Confira a edição exigida em novo edital.'),
 resource('Normas do Banco Central','ban',S.laws,'Busque as resoluções citadas nas aulas e verifique a vigência.'),
 {...library[0]},
 {...library[2],subject:'mat'},
 resource('Prática de leitura em inglês','eng',S.english,'Textos e exercícios graduais do British Council.','Curso gratuito · leitura em inglês'),
 resource('Cartilha de Segurança para Internet','inf',S.cert,'Livro e fascículos gratuitos sobre golpes, proteção e boas práticas.','Livro gratuito · CERT.br'),
 resource('Manual de Redação da Presidência','red',sources.manual,'Use clareza, coesão e linguagem formal como apoio. A redação do BB é dissertativa argumentativa, não um ofício.','Manual gratuito')];
const tech:Resource[]=[
 resource('Python 3.9 — tutorial','ti',S.python,'Tutorial da versão citada no edital histórico. Pratique exemplos localmente.'),
 resource('PostgreSQL — SQL','ti',S.sql,'SELECT, junções, agregações e transações. Documentação atual como complemento.'),
 resource('Scikit-learn — aprendizagem de máquina','ti',S.ml,'Modelos, métricas e pré-processamento. Documentação atual; compare com o programa histórico.'),
 resource('NumPy — fundamentos','ti',S.numpy,'Arrays, dimensões e operações vetorizadas.'),
 resource('Pandas — introdução','ti',S.pandas,'DataFrames, seleção, agrupamento e tratamento de dados.'),
 resource('Java SE 11','ti',S.java,'Documentação da versão prevista no edital de referência.'),
 resource('TypeScript — Handbook','ti',S.ts,'Tipos e interfaces. Documentação atual; a referência histórica cita a versão 4.0.'),
 resource('Android — guias','ti',S.mobile,'Fundamentos do desenvolvimento móvel; observe as versões do edital.'),
 resource('Swift — linguagem','ti',S.swift,'Tipos, funções e estruturas para apoiar a trilha móvel.'),
 resource('Ansible — primeiros passos','ti',S.ansible,'Inventários, playbooks e automação.'),
 resource('MongoDB — introdução','ti',S.mongo,'Documentos, coleções e operações NoSQL.')];
function bb(id:'bb-comercial'|'bb-tecnologia'):Course{
 const commercial=id==='bb-comercial';
 const ss=[...basic,...(commercial?[sub('fin','Matemática Financeira',5,7.5),sub('ban','Conhecimentos Bancários',10,15),sub('inf','Informática',15,22.5),sub('ven','Vendas e Negociação',15,22.5)]:[sub('est','Probabilidade e Estatística',5,7.5),sub('ban','Conhecimentos Bancários',5,7.5),sub('ti','Tecnologia da Informação',35,52.5)]),sub('red','Redação',0,0)];
 const ids=new Set(ss.map(s=>s.id));const ls=bbLessons.filter(l=>ids.has(l.subject));
 const rotation=commercial?['por','ven','inf','mat','ban','red','eng','ven','inf','fin','atu','red']:['ti','por','ti','mat','ban','red','ti','eng','ti','est','atu','red'];
 const cursors:Record<string,number>={};
 const schedule=Array.from({length:12},(_,week)=>['Ciclo de preparação',`Semana ${week+1}`,week<8?'Alterne matérias, priorize os maiores pesos e pratique redação toda semana.':'Revisite os assuntos, pratique redação e corrija seus erros.',...Array.from({length:6},(_,day)=>{const subject=rotation[(week*6+day)%rotation.length];const pool=ls.filter(l=>l.subject===subject);const index=cursors[subject]||0;cursors[subject]=index+1;return pool[index%pool.length].id;})]);
 const counts:Record<string,number>={};for(const week of schedule)for(const id of week.slice(3))counts[id]=(counts[id]||0)+1;
 for(const missing of ls.filter(l=>!counts[l.id])){let placed=false;for(let wi=schedule.length-1;wi>=0&&!placed;wi--)for(let di=7;di>=3&&!placed;di--){const previous=schedule[wi][di];if(counts[previous]>1){counts[previous]--;schedule[wi][di]=missing.id;counts[missing.id]=1;placed=true;}}}
 return {id,name:'Banco do Brasil',role:commercial?'Escriturário · Agente Comercial':'Escriturário · Agente de Tecnologia',short:commercial?'BB · Comercial':'BB · Tecnologia',status:'Preparação antecipada',reference:'Edital 2022/001 · prova de 2023',description:commercial?'Atendimento, vendas, conhecimentos bancários e negócios.':'Programação, dados, inteligência artificial e conhecimentos bancários.',accent:commercial?'#b29431':'#677bd5',lessons:ls,questions:bbQuestions.filter(q=>ids.has(q.subject)),subjects:ss,library:[...shared.filter(r=>r.subject==='all'||ids.has(r.subject)),...(commercial?[]:tech)],weeks:schedule,fullCount:70,fullMinutes:300,official:S.official,edital:S.edital,exam:commercial?S.commercialExam:S.techExam,answerKey:commercial?S.commercialKey:S.techKey,essay:true};
}
export const courses:Course[]=[{id:'curitiba',name:'Prefeitura de Curitiba',role:'Agente Administrativo',short:'Curitiba',status:'Edital 4/2026',examDate:'2026-12-13',reference:'Edital 4/2026 · retificado em 15/10/2026 · FAFIPA',description:'Administração pública, português, raciocínio, informática e legislação.',accent:'#388571',lessons,questions,subjects,library,weeks,fullCount:40,fullMinutes:240,official:sources.banca,edital:sources.edital,exam:sources.prova,answerKey:sources.gabarito,essay:false},bb('bb-comercial'),bb('bb-tecnologia')];
