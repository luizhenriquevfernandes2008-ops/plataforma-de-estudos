import type {Question} from './questions';
export const bbQuestions:Question[]=[];
type Row=[string,string,string,string,string,string,string];
function add(subject:string,lesson:string,rows:Row[]){for(const [text,right,...tail] of rows){const explanation=tail.pop()!;const index=bbQuestions.length;const correct=(index*3+1)%5;const options=[...tail];options.splice(correct,0,right);bbQuestions.push({id:`q${index+1}`,subject,lesson,text,options,correct,explanation,difficulty:'Fundamentos e aplicação'})}}
add('por','p01',[
['“O aplicativo ampliou o acesso, mas parte dos clientes ainda necessita de atendimento presencial.” O texto sustenta que:','Há clientes para os quais o atendimento presencial continua necessário.','Todos dispensam atendimento presencial.','O aplicativo foi encerrado.','Nenhum cliente usa o aplicativo.','A ampliação do acesso fracassou inteiramente.','A adversativa limita o alcance da primeira afirmação, sem negar a ampliação do acesso.'],
['“Somente alguns pedidos foram aprovados.” Uma conclusão necessária é:','Nem todos os pedidos foram aprovados.','Nenhum pedido foi aprovado.','Todos foram aprovados.','Os pedidos não foram analisados.','Todos serão aprovados amanhã.','A expressão somente alguns exclui a totalidade, mas não informa decisões futuras.']]);
add('por','p02',[
['Em “A documentação estava incompleta; portanto, foi solicitada complementação”, portanto expressa:','Conclusão.','Alternância.','Comparação.','Concessão.','Tempo.','Portanto liga a solicitação a uma conclusão decorrente da informação anterior.'],
['Em “O cliente trouxe os documentos e os entregou”, o pronome os retoma:','Os documentos.','O cliente.','O atendimento.','A agência.','O verbo trouxe.','O pronome oblíquo substitui o objeto documentos para evitar repetição.']]);
add('por','p03',[
['Complete: “Não entendi ___ o cadastro foi recusado. Foi recusado ___ faltava um dado.”','por que / porque','porque / por que','porquê / porque','por quê / porquê','porque / porquê','Por que introduz pergunta indireta; porque introduz explicação.'],
['Assinale o emprego adequado.','A gerente agiu com discrição.','A descrição da gerente foi manter segredo.','A gerente agiu com descrissão.','A descrição é sempre o ato de ser discreto.','Discrição significa apenas descrever objetos.','Discrição é reserva ou prudência; descrição é o ato de descrever.']]);
add('por','p04',[
['Assinale a concordância adequada.','Havia muitas pessoas na fila.','Haviam muitas pessoas na fila.','Fazem dois anos que abriu.','Existe muitas dúvidas.','Os dados foi conferido.','Haver com sentido de existir é impessoal e permanece no singular.'],
['Em “As propostas foram analisadas pela equipe”, o sujeito é:','As propostas.','Pela equipe.','Analisadas.','Foram.','A equipe analisadora.','Na voz passiva, as propostas é sujeito paciente; pela equipe é agente da passiva.']]);
add('por','p05',[
['Em “Cliente, confira os dados”, a vírgula isola:','Vocativo.','Sujeito.','Objeto direto.','Predicativo.','Adjunto adnominal.','Cliente é o chamamento ao interlocutor, isto é, vocativo.']]);
add('por','p07',[
['Assinale a frase com crase adequada.','O atendente se referiu à proposta.','O atendente começou à analisar.','O atendente entregou à ele.','O atendente voltou à pé.','O atendente conferiu à todos.','Referir-se exige a preposição a; proposta admite artigo a, formando à.'],
['A colocação pronominal adequada à norma-padrão é:','Não se esqueça dos documentos.','Não esqueça-se dos documentos.','Não esqueça dos documentos-se.','Se não esqueça dos-se documentos.','Não-se esqueça dos documentos.','A palavra negativa favorece a próclise: não se esqueça.']]);
add('eng','en01',[
['“Online services are convenient, but they are not suitable for every situation.” O trecho afirma que:','Há situações em que serviços online não são adequados.','Serviços online nunca são convenientes.','Todos os atendimentos devem ser online.','Não existem serviços online.','Every significa nenhuma.','Not suitable for every situation limita a adequação sem negar a conveniência.'],
['A técnica de procurar rapidamente uma data específica em um texto chama-se:','Scanning.','Summarizing.','Translating every word.','Guessing randomly.','Proofreading only.','Scanning é a leitura voltada à localização de informação específica.']]);
add('eng','en02',[
['“Customers should review the fees.” Should expressa, nesse contexto:','Recomendação.','Fato exclusivamente passado.','Impossibilidade.','Negação.','Obrigação física inevitável.','Should costuma apresentar recomendação ou expectativa, conforme o contexto.'],
['Em “The process is simple. However, it requires attention”, however introduz:','Contraste.','Adição sem contraste.','Exemplo.','Finalidade.','Quantidade.','However significa porém ou entretanto e estabelece contraste.']]);
add('eng','en03',[
['Em um texto sobre crédito, loan significa:','Empréstimo.','Agência.','Senha.','Tarifa.','Comprovante de endereço.','Loan designa empréstimo; branch é agência e fee é tarifa.'],
['Em “The bank sends alerts. They help customers”, they retoma:','Alerts.','Bank.','Customers necessariamente.','Sends.','Help.','O antecedente plural que faz sentido como agente da ajuda é alerts.']]);
add('mat','m01',[
['Quanto é 3/4 de 200?','150','50','75','100','180','Multiplique 200 por 3 e divida por 4: 150.'],
['2,5 metros equivalem a:','250 centímetros.','25 centímetros.','2.500 centímetros.','0,25 centímetro.','250 milímetros.','Um metro tem 100 centímetros; 2,5×100=250.']]);
add('mat','m02',[
['Três equipes, com a mesma produtividade, concluem uma tarefa em 8 horas. Seis equipes a concluem em:','4 horas.','16 horas.','8 horas.','2 horas.','12 horas.','Para tarefa fixa e produtividade constante, duplicar equipes reduz o tempo à metade.']]);
add('mat','m03',[
['Um valor de R$200 aumenta 10% e depois cai 10%. O resultado é:','R$198.','R$200.','R$202.','R$180.','R$220.','Os fatores são 1,10 e 0,90: 200×1,10×0,90=198.']]);
add('mat','ma04',[
['Se f(x)=2x+3, então f(5) vale:','13','10','8','15','25','Substituindo x por 5, temos 2×5+3=13.'],
['log₂32 é igual a:','5','4','6','16','30','Como 2⁵=32, o logaritmo é 5.']]);
add('mat','ma05',[
['O determinante de [[2,1],[3,4]] é:','5','11','8','3','−5','O determinante 2×2 é ad−bc=2×4−1×3=5.'],
['No sistema x+y=7 e x−y=1, x vale:','4','3','6','7','8','Somando as equações: 2x=8, logo x=4.']]);
add('mat','ma06',[
['Na PA 5,8,11,..., o quinto termo vale:','17','14','20','15','16','A razão é 3. Use aₙ=a₁+(n−1)r: a₅=5+(5−1)×3=17.'],
['Na PG 3,6,12,..., o quinto termo vale:','48','24','36','60','96','A razão é 2; a5=3×2⁴=48.']]);
add('mat','ma07',[
['A negação de “Se p, então q” é:','p e não q.','não p e q.','não p ou q.','p ou q.','Se q, então p.','A condicional falha exatamente com antecedente verdadeiro e consequente falso.'],
['A tem 20 elementos, B tem 15 e a interseção tem 5. A união tem:','30 elementos.','40 elementos.','35 elementos.','25 elementos.','20 elementos.','Some as quantidades e subtraia a duplicação da interseção: 20+15−5=30.']]);
add('atu','am01',[
['Uma fintech é caracterizada principalmente por:','Uso de tecnologia em soluções e serviços financeiros.','Dispensa de toda regulação financeira.','Proibição de canais digitais.','Emissão obrigatória de moeda soberana.','Ausência de riscos operacionais.','Tecnologia é central ao modelo, mas as regras dependem das atividades desempenhadas.'],
['A continuidade de um atendimento iniciado no aplicativo e concluído na agência, com histórico integrado, exemplifica:','Integração entre canais.','Eliminação de todos os canais.','Ausência de jornada do cliente.','Operação exclusiva de câmbio.','Obrigatoriedade de papel em todas as etapas.','A integração permite continuidade da jornada e reduz repetição de informações.']]);
add('atu','am02',[
['O Pix é:','Um meio de pagamento instantâneo criado pelo Banco Central.','Uma criptomoeda sem emissor soberano.','Uma ação negociada em bolsa.','Uma modalidade de seguro.','Uma linha obrigatória de empréstimo.','Pix é meio de pagamento em reais, e não criptoativo ou título de investimento.']]);
add('atu','am03',[
['No compartilhamento de dados pelo Open Finance, é correto afirmar que:','Há regras de autorização e de segurança aplicáveis.','Os dados tornam-se públicos automaticamente.','O cliente precisa publicar sua senha.','Todo compartilhamento é irreversível.','Não existem instituições participantes reguladas.','Open Finance envolve compartilhamento regulado, e não exposição indiscriminada dos dados.']]);
add('atu','am04',[
['Expressar o preço de um produto em reais usa a moeda como:','Unidade de conta.','Garantia real.','Algoritmo de consenso.','Contrato de seguro.','Título acionário.','A unidade de conta fornece uma referência comum para expressar valores.'],
['Shadow banking refere-se a:','Intermediação de crédito fora do sistema bancário tradicional.','Toda atividade ilegal realizada na internet.','Apenas falsificação de notas.','Um serviço exclusivo de bancos centrais.','Um sinônimo de moeda física.','O conceito não pode ser reduzido a ilegalidade ou a um único instrumento.']]);
add('ban','ba01',[
['O órgão responsável por diretrizes gerais de política monetária e creditícia no SFN é:','CMN.','Uma agência do Banco do Brasil.','Um correspondente bancário.','Uma corretora privada.','Um cartório de imóveis.','O Conselho Monetário Nacional é um órgão normativo, distinto dos operadores.'],
['A CVM está diretamente associada à supervisão do mercado de:','Valores mobiliários.','Carteiras de vacinação.','Licenciamento de automóveis.','Emissão de passaportes.','Registro civil.','A Comissão de Valores Mobiliários atua no mercado de valores mobiliários.'],
['Uma emissão de ações por companhia está ligada ao mercado:','De capitais.','Exclusivamente cambial.','Apenas monetário de curtíssimo prazo.','De trabalho informal.','De seguros rurais obrigatoriamente.','Ações são valores mobiliários vinculados ao mercado de capitais.']]);
add('ban','ba02',[
['Quem define a meta da taxa Selic?','Copom.','Cada agência bancária isoladamente.','A assembleia de cada condomínio.','Um cliente correntista.','Um cartório.','O Comitê de Política Monetária do Banco Central define a meta da Selic.'],
['Juros nominais de 10% e inflação de 5% correspondem à taxa real exata aproximada de:','4,76%.','5,00% exatamente.','15%.','10,5%.','−5%.','Pela relação exata: 1,10/1,05−1≈0,047619.']]);
add('ban','ba03',[
['Liquidez de um ativo está relacionada à:','Facilidade de convertê-lo em recursos disponíveis, consideradas as condições de negociação.','Garantia de maior rentabilidade.','Ausência de qualquer risco.','Quantidade de agências do emissor.','Impossibilidade de resgate em qualquer data.','Liquidez descreve conversão e disponibilidade, não retorno garantido.'],
['Ao comparar ofertas de crédito, o cliente deve observar:','Custos, prazo, condições e capacidade de pagamento.','Somente o valor do primeiro boleto.','Apenas a cor do cartão.','Só o tamanho da agência.','Exclusivamente a propaganda.','Comparar apenas uma parcela ignora custos e condições relevantes.']]);
add('ban','ba04',[
['A cotação passa de R$5 para R$6 por dólar. Isso representa:','Desvalorização do real frente ao dólar.','Valorização do real frente ao dólar.','Queda do preço do dólar em reais.','Proibição de importações.','Inflação zero obrigatória.','Agora são necessários mais reais para comprar um dólar.'],
['Uma compra de US$200 à cotação de R$5 por dólar, sem outros custos, equivale a:','R$1.000.','R$40.','R$205.','R$400.','R$5.000.','Multiplica-se o valor em dólares pela cotação: 200×5=1.000.']]);
add('ban','ba05',[
['Sobre garantias de crédito, é correto afirmar que:','Elas não dispensam análise de capacidade de pagamento.','Elas tornam todo crédito sem risco.','Aval e fiança são sempre idênticos.','Qualquer bem pode garantir qualquer operação sem requisitos.','Elas eliminam a necessidade de contrato.','Garantias não substituem avaliação de risco e adequação da operação.']]);
add('ban','ba06',[
['A finalidade de conhecer o cliente em controles de PLD é:','Apoiar identificação, perfil e avaliação de riscos.','Ensinar a contornar monitoramento.','Publicar dados bancários na internet.','Eliminar todos os registros.','Garantir que nenhuma análise seja realizada.','Conhecer o cliente apoia prevenção e monitoramento compatíveis com o risco.'],
['Uma operação atípica identificada por controles internos deve ser:','Analisada segundo os procedimentos aplicáveis.','Automaticamente divulgada a qualquer pessoa.','Ignorada para evitar trabalho.','Tratada como condenação judicial definitiva.','Apagada dos registros sem exame.','Atipicidade demanda análise; não equivale por si só a decisão judicial.']]);
add('ban','ba07',[
['O menor privilégio recomenda:','Conceder apenas os acessos necessários à função.','Dar acesso irrestrito a todos.','Compartilhar senhas da equipe.','Desativar logs.','Consultar contas por curiosidade.','Permissões devem ser proporcionais à necessidade legítima de atuação.'],
['Consentimento na LGPD é:','Uma das bases legais possíveis.','A única base para qualquer tratamento.','Dispensa de segurança.','Permissão para qualquer uso futuro.','Sinônimo de tornar dados públicos.','A LGPD prevê outras bases legais e mantém deveres de proteção e finalidade.']]);
add('ban','ba08',[
['A dimensão G de ASG corresponde a:','Governança.','Garantia de rentabilidade.','Gratuidade universal.','Ganho cambial.','Gestão apenas de resíduos.','ASG reúne ambiental, social e governança.'],
['Uma conduta coerente com ética profissional é:','Reconhecer e tratar conflitos de interesses.','Omitir custos para atingir metas.','Consultar dados sem finalidade.','Prometer o que não pode cumprir.','Aceitar vantagem indevida.','Integridade exige transparência e tratamento adequado de conflitos.']]);
add('fin','fi01',[
['R$2.000 aplicados a juros simples de 2% ao mês por 3 meses geram juros de:','R$120.','R$60.','R$1.200.','R$240.','R$2.120.','J=Cin=2.000×0,02×3=120. R$2.120 seria o montante.'],
['Em juros simples, R$1.000 tornam-se R$1.150 em 5 meses. A taxa mensal é:','3%.','15%.','5%.','1,5%.','30%.','i=(M−C)/(Cn)=150/(1000×5)=0,03.'],
['Taxa de 12% ao ano em juros simples, aplicada por 6 meses, gera juros correspondentes a:','6% do capital.','12% do capital.','72% do capital.','2% do capital.','24% do capital.','Seis meses equivalem a meio ano: 12%×0,5=6%.']]);
add('fin','fi02',[
['R$1.000 a juros compostos de 10% por período durante 2 períodos tornam-se:','R$1.210.','R$1.200.','R$1.100.','R$1.020.','R$2.000.','Nos juros compostos, cada período incide sobre o saldo acumulado: M=1000×1,10²=1210.'],
['Uma taxa de 2% ao mês tem taxa composta equivalente em 2 meses de:','4,04%.','4% exatamente.','2,04%.','0,04%.','8%.','Multiplique os fatores de capitalização: (1,02)²−1=0,0404, isto é, 4,04%. Somar as taxas daria apenas uma aproximação.'],
['Para trazer um montante futuro ao presente, em juros compostos, deve-se:','Dividir pelo fator (1+i)^n.','Multiplicar sempre por n.','Somar a taxa nominal ao montante.','Ignorar o prazo.','Subtrair qualquer percentual fixo.','A operação inversa da capitalização desconta pelo fator acumulado.']]);
add('fin','fi03',[
['R$1.210 recebidos em 2 períodos à taxa de 10% por período equivalem hoje a:','R$1.000.','R$1.100.','R$990.','R$1.210.','R$1.331.','Para trazer o valor futuro à data atual, desconte pelo fator composto: VP=1210/1,1²=1000.'],
['Para comparar valores em diferentes datas, é necessário:','Transportá-los para uma mesma data focal.','Somá-los sem considerar tempo.','Comparar somente os centavos.','Desconsiderar a taxa.','Sempre escolher o valor nominal menor.','Equivalência financeira exige data focal, taxa e regime coerentes.']]);
add('fin','fi04',[
['No SAC, sob taxa fixa, o componente constante é:','Amortização.','Juros.','Saldo devedor.','Prazo restante.','Prestação em qualquer contrato.','A amortização é constante; os juros diminuem conforme o saldo devedor cai.'],
['No Price com taxa fixa e períodos regulares, normalmente:','A prestação é constante e a amortização cresce.','A amortização é sempre constante.','Os juros crescem a cada parcela obrigatoriamente.','Não há juros.','O saldo nunca diminui.','A prestação fixa combina juros decrescentes e amortização crescente.']]);
add('inf','i01',[
['Apagar um atalho para um aplicativo geralmente:','Remove o atalho, sem desinstalar o aplicativo.','Apaga todo o sistema operacional.','Formata o disco.','Remove todos os arquivos do usuário.','Desativa a memória RAM.','Atalho é uma referência; não é o próprio conjunto de arquivos do programa.'],
['Uma extensão de arquivo ajuda a identificar:','O tipo ou formato associado ao arquivo.','A identidade comprovada do autor.','A ausência garantida de vírus.','O tamanho exato da tela.','A velocidade da internet.','Extensões indicam formatos, mas podem ser alteradas e não provam segurança.']]);
add('inf','i04',[
['Em uma planilha, =$A$1 mantém ao copiar a fórmula:','Coluna A e linha 1 fixas.','Apenas a coluna fixa.','Apenas a linha fixa.','Ambas sempre variáveis.','Nenhuma referência válida.','Os dois símbolos $ fixam coluna e linha.'],
['Se A1=10 e A2=20, =SOMA(A1:A2) resulta em:','30','10','20','200','15','SOMA adiciona os valores do intervalo.'],
['Se B1=8, a fórmula =SE(B1>=7;"Aprovado";"Revisar") retorna:','Aprovado','Revisar','7','8','FALSO','A condição 8>=7 é verdadeira, então o primeiro texto é retornado.'],
['Ao copiar =A1 de uma célula para uma coluna à direita, mantendo a linha, a referência passa a:','B1','A1 necessariamente.','$A$1','A2','B2','Referências relativas acompanham o deslocamento da cópia.']]);
add('inf','i05',[
['Phishing é uma técnica que costuma:','Imitar comunicações confiáveis para enganar pessoas.','Garantir autenticidade de sites.','Criptografar automaticamente backups.','Substituir a necessidade de senhas.','Desligar todas as redes.','O engano busca obter dados ou induzir ações, explorando confiança e urgência.'],
['Backup tem como finalidade principal:','Permitir recuperar dados a partir de uma cópia.','Aumentar o brilho da tela.','Eliminar qualquer golpe.','Substituir toda atualização.','Dar permissão irrestrita a arquivos.','Uma cópia adequada permite restauração; precisa ser protegida e testada.'],
['HTTPS indica principalmente:','Proteção do transporte por TLS e autenticação do servidor conforme certificado.','Que o conteúdo do site é necessariamente verdadeiro.','Que não existe fraude no site.','Que todo arquivo está livre de malware.','Que o usuário não precisa conferir o domínio.','HTTPS protege o canal; não garante honestidade de toda página.'],
['Autenticação multifator combina preferencialmente:','Fatores de categorias diferentes.','Duas senhas iguais.','Dois nomes de usuário.','Duas perguntas com respostas públicas apenas.','Dois cliques sem verificação.','Combinar conhecimento, posse ou características inerentes fortalece a autenticação.'],
['Intranet é:','Uma rede de uso interno organizacional com tecnologias de rede.','Toda a internet pública.','Um tipo de vírus.','Uma unidade de armazenamento óptico.','Uma linguagem de planilhas.','A intranet atende ao contexto interno da organização; não equivale à internet inteira.']]);
add('inf','in04',[
['Um firewall pessoal tem a função de:','Controlar tráfego de rede conforme regras.','Editar textos com estilos.','Substituir cópias de segurança.','Calcular médias em planilhas.','Garantir que o usuário nunca erre.','O firewall filtra conexões; ele é um componente de proteção, não solução universal.'],
['Hardening envolve:','Fortalecer configurações e reduzir serviços desnecessários.','Compartilhar todas as credenciais.','Desativar permanentemente atualizações.','Instalar programas sem verificar origem.','Dar privilégios máximos a todos.','Reduzir superfície de ataque é parte do fortalecimento do ambiente.'],
['Em Linux, permissões de arquivo podem controlar:','Leitura, escrita e execução.','Apenas o brilho do monitor.','Somente a cor do ícone.','Exclusivamente o volume do áudio.','O valor da taxa de câmbio.','O modelo tradicional de permissões inclui leitura, escrita e execução.']]);
add('inf','in05',[
['Em um editor de texto, estilos são úteis para:','Padronizar formatação e estruturar o documento.','Apagar obrigatoriamente todo o conteúdo.','Impedir qualquer sumário.','Substituir o sistema operacional.','Garantir correção factual.','Estilos organizam títulos e parágrafos e podem apoiar sumários automáticos.'],
['Histórico de versões permite:','Consultar alterações e recuperar versões, conforme a ferramenta.','Impedir todo conflito humano.','Dispensar permissões de acesso.','Publicar sempre o documento na internet.','Remover qualquer necessidade de revisão.','O histórico oferece rastreabilidade, mas não substitui regras de colaboração.'],
['Em uma apresentação, uma prática que favorece clareza é:','Usar hierarquia visual e pouco texto por ideia.','Inserir todos os parágrafos de um livro em um slide.','Remover todo contraste.','Usar fontes ilegíveis.','Trocar de assunto sem conexão.','Síntese e hierarquia ajudam a organizar o que a audiência deve acompanhar.']]);
add('inf','in06',[
['O campo Cco em e-mail serve para:','Enviar cópia sem expor esses destinatários aos demais comuns.','Garantir criptografia do conteúdo.','Confirmar leitura obrigatória.','Excluir todos os anexos.','Enviar mensagens apenas para si.','Cco oculta endereços dos destinatários copiados; não criptografa a mensagem.'],
['Uma wiki caracteriza-se por:','Permitir construção e edição colaborativa de conteúdo.','Ser exclusivamente um antivírus.','Funcionar apenas como disco rígido.','Impedir alterações em qualquer circunstância.','Substituir protocolos de rede.','Wikis apoiam produção colaborativa, com controles e histórico conforme a implementação.'],
['Antes de confiar em informação encontrada em busca, é adequado:','Verificar origem, contexto e data.','Aceitar sempre o primeiro resultado.','Usar apenas o número de curtidas.','Ignorar a autoria.','Concluir que anúncio é prova oficial.','Posição na busca e popularidade não garantem confiabilidade.']]);
add('ven','ve01',[
['Segmentação de mercado significa:','Agrupar públicos por características relevantes ao atendimento.','Oferecer sempre a mesma solução a todos.','Eliminar pesquisa de necessidades.','Proibir diferenciação de serviços.','Ignorar o comportamento do cliente.','Segmentação apoia compreensão e atendimento de necessidades semelhantes.'],
['Uma proposta de valor deve conectar a oferta:','À necessidade e aos benefícios percebidos pelo cliente.','Somente à meta interna do vendedor.','A promessas sem evidências.','A informações omitidas.','Exclusivamente ao maior preço.','Valor envolve benefícios relevantes e custos para o público atendido.'],
['Posicionamento de uma marca está ligado:','À percepção pretendida em relação às alternativas.','Apenas ao endereço físico da agência.','Ao número da conta do cliente.','Exclusivamente ao saldo do caixa.','À eliminação dos concorrentes por decreto.','Posicionamento trata da forma como a oferta pretende ser percebida no mercado.']]);
add('ven','ve02',[
['A impossibilidade de estocar uma hora de atendimento não utilizada relaciona-se à:','Perecibilidade dos serviços.','Imutabilidade de todos os serviços.','Garantia de demanda futura.','Padronização absoluta.','Tangibilidade obrigatória.','Capacidade de serviço não utilizada em um período não é simplesmente estocada para outro.'],
['Um atendimento cordial, mas sem solução repetidas vezes, indica que:','Cordialidade sozinha não garante boa experiência.','A experiência é necessariamente excelente.','A demanda do cliente deixou de existir.','Nenhum processo precisa de revisão.','Satisfação e resolução são sempre idênticas.','A experiência inclui esforço, continuidade e resolução, além do trato interpessoal.'],
['Escutar ativamente envolve:','Ouvir, esclarecer e confirmar a compreensão.','Interromper para apresentar qualquer produto.','Pressupor a necessidade sem perguntar.','Ignorar objeções.','Memorizar uma fala sem adaptação.','A confirmação reduz interpretações equivocadas sobre a necessidade.']]);
add('ven','ve03',[
['A primeira etapa de uma venda consultiva deve priorizar:','Diagnóstico da necessidade.','Pressão para assinatura imediata.','Omissão de custos.','Venda do produto mais caro independentemente do perfil.','Promessa de retorno sem risco.','A solução adequada depende de compreender o problema e o contexto do cliente.'],
['Uma objeção sobre a parcela deve ser tratada inicialmente com:','Perguntas para entender a restrição e esclarecimentos.','Desqualificação do cliente.','Ocultação do custo total.','Aumento compulsório de limite.','Encerramento agressivo do atendimento.','A objeção pode expressar diferentes necessidades ou dúvidas que precisam ser compreendidas.'],
['Em negociação, interesses diferem de posições porque:','Interesses expressam necessidades subjacentes às demandas declaradas.','Interesses são sempre valores monetários.','Posições nunca podem mudar.','Interesses devem ser ignorados.','São conceitos necessariamente idênticos.','A posição é a demanda apresentada; o interesse ajuda a explicar o motivo.'],
['Ter uma alternativa caso não haja acordo ajuda a:','Definir limites e avaliar propostas.','Garantir que qualquer acordo seja aceito.','Eliminar a necessidade de ouvir.','Tornar a negociação ilegal.','Impedir preparação.','Conhecer alternativas evita aceitar condições piores sem avaliar possibilidades.']]);
add('ven','ve04',[
['De 500 visitantes de uma oferta, 25 contratam. A conversão é:','5%.','20%.','25%.','2%.','50%.','A taxa de conversão divide contratações por visitantes: 25/500=0,05, ou 5%.'],
['Pós-venda tem como objetivo:','Acompanhar a experiência e resolver dificuldades após a contratação.','Impedir todo cancelamento por obstáculos artificiais.','Encerrar definitivamente o relacionamento.','Ignorar reclamações.','Substituir a informação pré-contratual.','O acompanhamento sustenta valor e relacionamento, sem restringir direitos.'],
['Número alto de cliques em campanha:','Não garante, sozinho, satisfação ou contratação adequada.','Prova automaticamente excelente experiência.','Dispensa medir conversão.','Elimina toda necessidade de análise.','É sempre igual à receita obtida.','Métricas medem aspectos diferentes do funil e da experiência.']]);
add('ven','ve05',[
['Uma prática de atendimento acessível é:','Disponibilizar informação em formato compreensível e utilizável pelo cliente.','Falar sempre somente com o acompanhante.','Negar adaptações sem análise.','Presumir incapacidade de decisão.','Exigir o mesmo canal mesmo quando inacessível.','Acessibilidade busca remover barreiras e respeitar autonomia.'],
['Condicionar indevidamente um produto à contratação de outro caracteriza, em regra:','Venda casada.','Venda consultiva obrigatória.','Atendimento prioritário.','Portabilidade.','Segmentação legítima automaticamente.','A imposição indevida de contratação conjunta é vedada pelo CDC nas condições legais.'],
['Informar custos e riscos de forma clara contribui para:','Decisão consciente do consumidor.','Eliminar todo risco econômico.','Dispensar leitura de contrato sempre.','Garantir aprovação no concurso.','Ocultar condições essenciais.','Transparência permite avaliar a adequação e as consequências da contratação.']]);
add('ven','ve06',[
['Ao receber reclamação fora de sua competência, o atendente deve:','Registrar e orientar o encaminhamento ao canal adequado.','Prometer qualquer resultado.','Apagar a demanda.','Culpar o cliente sem análise.','Expor o caso publicamente.','Registro e encaminhamento preservam rastreabilidade e clareza sobre o próximo passo.'],
['Reclamações recorrentes podem servir para:','Identificar causas e melhorar processos.','Provar que os clientes nunca têm razão.','Eliminar mecanismos de controle.','Justificar omissão de informação.','Evitar qualquer registro.','Demandas recorrentes são sinais úteis para aprendizagem organizacional.'],
['O tratamento imparcial de uma demanda requer:','Análise dos fatos e das regras aplicáveis.','Defesa automática de qualquer ato da instituição.','Preferência por conhecidos.','Divulgação indiscriminada de dados.','Decisão somente pela aparência do cliente.','Imparcialidade afasta favorecimento e exige avaliação fundamentada.']]);
add('est','es01',[
['A média de 2,4,6,8 é:','5','4','6','20','2','A soma é 20 e há 4 valores: 20/4=5.'],
['A mediana de 2,3,3,4,18 é:','3','6','18','4','2','Após ordenar, o terceiro valor ocupa a posição central.']]);
add('est','es02',[
['A amplitude dos dados 4,7,11 é:','7','18','11','4','3','A amplitude é a diferença entre o maior e o menor valor: 11−4=7.'],
['Correlação positiva entre duas variáveis demonstra necessariamente:','Associação linear positiva, sem provar causalidade por si só.','Causalidade direta sem qualquer hipótese adicional.','Igualdade das variáveis.','Ausência de fatores externos.','Erro de coleta obrigatório.','Correlação mede associação; explicação causal exige evidências e desenho apropriados.']]);
add('est','es03',[
['Em um grupo de 40 usuários de aplicativo, 10 fizeram uma operação. A frequência relativa dessa operação no grupo é:','25%.','10%.','40%.','4%.','75%.','10/40=0,25. O denominador é o grupo condicionado.'],
['Se A e B são independentes, P(A)=0,5 e P(B)=0,4, então P(A∩B) é:','0,2','0,9','0,1','0,5','0,4','Na independência, multiplique: 0,5×0,4=0,2.'],
['A expressão de Bayes para P(A|B), com P(B)>0, é:','P(B|A)P(A)/P(B).','P(A)+P(B).','P(A)/P(B|A) sempre.','P(B)−P(A).','P(B|A)/P(A) sempre.','O numerador representa a probabilidade conjunta e o denominador normaliza pela evidência B.']]);
add('est','es04',[
['Uma binomial com n=20 e p=0,1 tem média:','2','0,1','20','10','1,9','A esperança binomial é np=20×0,1=2.'],
['Uma distribuição normal é simétrica em torno de:','Sua média.','Seu valor máximo finito obrigatório.','Zero em todos os casos.','Um limite inferior fixo.','Sua variância, necessariamente.','A normal é simétrica em torno do parâmetro de localização, a média.']]);
add('est','es05',[
['Pesquisar somente clientes que usam um aplicativo, querendo representar todos os clientes, pode gerar:','Viés de seleção.','Representatividade garantida.','Censo completo necessariamente.','Ausência de incerteza.','Normalidade obrigatória.','A forma de seleção pode excluir perfis relevantes da população.'],
['Uma medida calculada sobre toda a população é chamada, no contexto inferencial, de:','Parâmetro.','Estatística amostral exclusivamente.','Erro padrão necessariamente.','Amostra aleatória.','Hipótese nula sempre.','Parâmetro caracteriza a população; estatística é calculada a partir de uma amostra.']]);
add('ti','ti01',[
['Prever um valor numérico de gasto a partir de exemplos rotulados é:','Regressão supervisionada.','Clustering obrigatoriamente.','Ordenação por bolha.','Normalização de tabelas.','Criptografia assimétrica.','Regressão prevê alvos numéricos usando relações aprendidas nos dados.'],
['Agrupar clientes sem rótulos prévios de grupo é um exemplo de:','Aprendizado não supervisionado.','Classificação supervisionada obrigatória.','Compilação de código.','Transação SQL.','Autenticação multifator.','Clustering busca estrutura nos dados sem grupos-alvo previamente informados.'],
['Excelente resultado no treino e resultado muito pior em dados novos pode indicar:','Sobreajuste.','Generalização perfeita garantida.','Ausência de parâmetros.','Nenhuma relação com o modelo.','Impossibilidade de avaliar desempenho.','O modelo pode ter ajustado detalhes do treino que não se generalizam.']]);
add('ti','ti02',[
['Ajustar normalização usando dados de treino e teste antes da avaliação pode causar:','Vazamento de dados.','Separação perfeita das amostras.','Garantia de ausência de viés.','Criptografia dos rótulos.','Aumento obrigatório da validade externa.','Informações do teste não devem influenciar o ajuste das transformações ou do modelo.'],
['Em 100 exemplos, 99 são negativos. Prever sempre negativo produz:','99% de acurácia e recall zero da classe positiva.','100% de recall positivo.','1% de acurácia.','99% de precisão positiva necessariamente.','Um modelo sempre adequado.','O alto desequilíbrio permite acurácia elevada mesmo sem encontrar nenhum positivo.'],
['Tokenização de texto consiste em:','Dividi-lo em unidades para processamento.','Garantir correção gramatical de todo texto.','Criptografar cada documento necessariamente.','Transformar qualquer texto em SQL.','Remover a necessidade de representação numérica.','Tokens podem ser palavras, subpalavras ou outras unidades conforme o método.']]);
add('ti','ti03',[
['Uma chave primária tem como papel:','Identificar unicamente uma linha.','Duplicar todas as linhas.','Guardar somente senhas.','Definir obrigatoriamente a primeira coluna visual.','Impedir qualquer relacionamento.','A chave primária identifica registros e deve obedecer às restrições de unicidade e não nulidade.'],
['Chave estrangeira apoia:','Integridade referencial.','Ordenação visual obrigatória.','Compressão de imagem.','Criptografia automática de disco.','Remoção de todas as tabelas.','Ela relaciona valores a uma chave referenciada conforme as regras de integridade.'],
['Normalização busca, entre outros objetivos:','Reduzir redundâncias e anomalias relacionadas a dependências.','Duplicar dados sem critério.','Eliminar todas as chaves.','Garantir qualquer consulta mais rápida.','Proibir relacionamentos entre entidades.','A análise de dependências orienta decomposições que reduzem problemas de atualização.']]);
add('ti','ti04',[
['Em SQL, a cláusula que filtra grupos agregados é:','HAVING.','ORDER BY.','FROM apenas.','SELECT sempre.','LIMIT sempre.','WHERE filtra linhas; HAVING filtra grupos após agregação.'],
['Para testar valor nulo em SQL, use:','IS NULL.','= NULL sempre.','== NULL sempre.','LIKE ZERO.','EQUAL EMPTY obrigatoriamente.','NULL exige predicados próprios; igualdade com NULL não funciona como uma igualdade comum.'],
['Um LEFT JOIN preserva:','Todas as linhas da tabela à esquerda, conforme a junção.','Somente as linhas sem correspondência.','Sempre apenas a tabela direita.','Nenhuma linha com valor nulo.','Exatamente uma linha em qualquer consulta.','Linhas sem correspondência recebem valores nulos do lado direito.'],
['COUNT(coluna) geralmente conta:','Valores não nulos da expressão.','Todos os nulos exclusivamente.','Somente valores distintos sempre.','O número de colunas da tabela.','A quantidade de bytes do índice.','COUNT(*) conta linhas; COUNT(expressão) desconsidera nulos.']]);
add('ti','ti05',[
['A propriedade ACID que expressa tudo ou nada é:','Atomicidade.','Durabilidade.','Disponibilidade.','Ordenação.','Compressibilidade.','Atomicidade evita que parte da transação seja efetivada isoladamente em caso de falha.'],
['COMMIT em uma transação serve para:','Confirmar suas alterações.','Desfazer sempre toda a base.','Excluir todos os índices.','Criar obrigatoriamente uma tabela.','Suspender autenticação.','COMMIT confirma; ROLLBACK desfaz alterações não confirmadas da transação.'],
['Sobre índices de banco de dados, é correto afirmar que:','Podem acelerar consultas, mas têm custo de armazenamento e manutenção.','Sempre aceleram qualquer operação.','Não ocupam espaço.','Eliminam todas as escritas.','Dispensam modelagem.','Índices ajudam padrões de acesso específicos e exigem manutenção nas mudanças de dados.']]);
add('ti','ti06',[
['O MongoDB é associado principalmente ao modelo:','De documentos.','Exclusivamente de arquivos de áudio.','De memória cache de CPU.','De árvores de diretórios do sistema operacional.','De planilhas sem registros.','O MongoDB organiza documentos BSON em coleções.'],
['Bancos orientados a grafos destacam:','Vértices e arestas.','Somente arquivos CSV isolados.','Apenas linhas de texto sem ligação.','Frequências de áudio.','Telas de apresentação.','Grafos modelam entidades e seus relacionamentos por vértices e arestas.'],
['Esquema flexível em NoSQL significa que:','A modelagem continua necessária, embora a estrutura possa variar.','É impossível validar dados.','Todo registro deve ser idêntico por definição.','Nunca existem transações.','A consistência não importa em nenhum sistema.','Flexibilidade não elimina decisões de estrutura, consultas e integridade.']]);
add('ti','ti07',[
['No esquema estrela, uma tabela fato relaciona-se tipicamente com:','Tabelas de dimensões.','Apenas arquivos de vídeo.','Somente logs do compilador.','Exclusivamente tabelas sem atributos.','Nenhuma outra estrutura.','Dimensões fornecem contextos para medidas registradas na tabela fato.'],
['A sequência representada por ETL é:','Extrair, transformar e carregar.','Executar, testar e listar.','Editar, traduzir e ler.','Excluir, truncar e limpar.','Escalar, treinar e localizar.','ETL descreve o fluxo de integração de dados com transformação antes da carga.'],
['Antes de agregar dados, uma verificação relevante é:','Avaliar duplicidades, ausências e tipos.','Supor que todos os registros são perfeitos.','Remover todas as chaves sem exame.','Ignorar unidades.','Misturar qualquer período sem identificar.','Problemas de qualidade podem distorcer agregações e decisões.']]);
add('ti','ti08',[
['Busca binária clássica exige:','Dados ordenados.','Dados sempre aleatórios sem ordem.','Apenas um elemento.','Todos os valores iguais necessariamente.','Exclusivamente listas circulares.','A ordenação permite descartar metade do intervalo com base na comparação.'],
['O custo típico da busca sequencial no pior caso, em n elementos, é:','O(n).','O(1) sempre.','O(log n) sempre.','O(n³) necessariamente.','O(2ⁿ) sempre.','Pode ser necessário examinar todos os elementos.'],
['O algoritmo que insere cada item na posição adequada da parte já ordenada é:','Insertion sort.','Busca binária.','Breadth-first search necessariamente.','Hashing.','Merge de tabelas SQL.','Insertion sort constrói a porção ordenada por inserções sucessivas.']]);
add('ti','ti09',[
['Uma pilha segue a disciplina:','LIFO.','FIFO necessariamente.','Ordem alfabética sempre.','Prioridade aleatória obrigatória.','Acesso apenas por chave SQL.','O último elemento inserido é o primeiro retirado.'],
['Uma fila simples segue:','FIFO.','LIFO necessariamente.','Ordem decrescente de valor sempre.','Apenas recursão binária.','Nenhuma regra de saída.','O primeiro a entrar é o primeiro a sair.'],
['Uma árvore binária tem, por nó, no máximo:','Dois filhos.','Um filho.','Três filhos.','Um pai e dez filhos obrigatórios.','Nenhum filho em todos os nós.','Binária limita a quantidade de filhos a dois, sem impor por si só uma ordenação de busca.']]);
add('ti','ti10',[
['Em Python, a=[1,2]; b=a; b.append(3). O valor de a é:','[1,2,3]','[1,2] necessariamente.','[3]','None','Uma tupla (1,2).','a e b referem-se à mesma lista mutável.'],
['Em Python 3, 7//2 resulta em:','3','3.5','4','2','0','O operador // usa divisão pelo piso; nesse caso positivo, o resultado é 3.'],
['Em Python, [0,1,2,3][1:3] resulta em:','[1,2]','[1,2,3]','[0,1,2]','[3]','[0,3]','A fatia inclui o início e exclui o limite final.']]);
add('ti','ti11',[
['O indexador pandas iloc seleciona por:','Posição inteira.','Rótulo exclusivamente.','Nome de arquivo somente.','Tipo de gráfico.','Senha do banco.','iloc é posicional; loc usa rótulos.'],
['Uma junção de tabelas com chaves repetidas nos dois lados pode:','Multiplicar linhas de acordo com as correspondências.','Garantir uma única linha sempre.','Impedir qualquer resultado.','Remover duplicidades automaticamente em todos os casos.','Converter tudo em um gráfico.','Cada combinação correspondente participa do resultado de uma junção muitos-para-muitos.'],
['No NumPy, broadcasting permite:','Operações entre arrays de formas compatíveis.','Ignorar qualquer incompatibilidade de forma.','Transmitir rádio obrigatoriamente.','Executar apenas strings.','Eliminar todas as dimensões.','As formas devem satisfazer regras de compatibilidade; não é uma autorização irrestrita.']]);
add('ti','ti12',[
['Tipos do TypeScript, após a compilação usual para JavaScript:','São removidos e não validam sozinhos dados em execução.','Permanecem como validação automática de todo JSON.','Transformam-se em criptografia.','Impedem todos os erros de lógica.','Substituem testes de aplicação.','A verificação estática não substitui validação de entradas externas em runtime.'],
['Polimorfismo permite:','Usar diferentes implementações por um contrato comum.','Eliminar todas as interfaces.','Impedir especialização de comportamento.','Representar apenas números inteiros.','Proibir objetos.','O código pode operar por abstrações e despachar para implementações específicas.']]);
add('ti','ti13',[
['Uma tarefa longa na thread principal de um app móvel pode:','Prejudicar a responsividade da interface.','Garantir fluidez em qualquer aparelho.','Eliminar o ciclo de vida.','Impedir consumo de energia.','Substituir todas as tarefas assíncronas.','A thread da interface precisa continuar atendendo eventos e desenhando a tela.'],
['Swift é uma linguagem fortemente associada ao desenvolvimento no ecossistema:','Apple.','Exclusivamente de planilhas Excel.','Apenas de comandos SQL.','Somente de playbooks Ansible.','De arquivos CSV sem programas.','Swift é usada no desenvolvimento para plataformas Apple, entre outros contextos.']]);
add('ti','ti14',[
['Em Ansible, o inventário descreve principalmente:','Os alvos gerenciados.','Somente cores da interface.','A nota da prova.','Exclusivamente índices SQL.','Arquivos de áudio da aplicação.','O inventário organiza hosts e grupos usados na automação.'],
['Uma operação idempotente tem como característica:','Repetições mantêm o mesmo efeito final desejado.','Cada execução duplica obrigatoriamente os dados.','Nunca pode ser automatizada.','Exige interação manual sempre.','Apaga tudo em qualquer execução.','Idempotência torna reaplicações previsíveis quando o estado desejado já foi alcançado.']]);
