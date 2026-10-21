# PEP 2.5.0 — aprendizado e organização

Aplicativo Windows x64. Não inclui uma edição para celular ou navegador.

| Recurso | Onde usar e o que faz |
|---|---|
| Diagnóstico por questões | Aba Diagnóstico de cada curso: duas questões por matéria objetiva; resultado influencia Estudos próprios, junto do perfil e dos erros. A amostra é curta, não prevê nota. |
| Revisões espaçadas | Aba Revisões: aulas concluídas, respostas e cartões próprios; intervalos de 1, 3, 7, 14, 30 e 60 dias. Erro retorna a amanhã. Itens antigos ganham fila pela data disponível. |
| Erros inteligentes | Classifique conteúdo, interpretação, distração ou cálculo; filtre matéria/motivo e treine até dez erros atuais. |
| Todas as alternativas | Abra Entender todas as alternativas após responder. As questões novas de Curitiba possuem justificativas específicas; nas demais, o comentário compara a alternativa com o gabarito e retoma a regra explicada na questão. Não é uma nova correção por IA. |
| Plano do dia | Escolha 15, 30 ou 60 minutos, com tempo para revisão, aula, prática e anotação. As prioridades consideram dificuldades e pendências sem acumular carga atrasada. Salvar o plano o coloca no calendário; não marca automaticamente a sessão como concluída. |
| Busca global | Ferramentas → Busca: aulas, resumos, apostila, questões, fontes, anotações, cartões e redações. Busca por palavras, ignorando acentos, no perfil aberto. |
| Diagnóstico dos simulados | Resultado por matéria, tempo médio, tempo por questão e assuntos a retomar. Histórico antigo sem medição é identificado como não registrado. |
| Modo prova | Simulados sem dicas ou recompensas e sem navegação para outras áreas; marque dúvidas, use o mapa de questões e corrija apenas ao concluir. Não é um sistema de fiscalização: Windows e outros programas continuam disponíveis. |
| Evolução da redação | Redações → Evolução: duas versões analisadas lado a lado; diferenças de nota somente para mesma modalidade, tipo e rubrica. Padrões são agrupados por palavras dos comentários da última revisão de cada texto. Exercícios geram rascunhos de treino livre. |
| Aulas interativas | Cinco etapas: entender, exemplo, explicar, aplicar e revisar. Sínteses de Curitiba complementam aulas; explicação livre é comparada pelo aluno à referência, sem fingir avaliação semântica automática. |
| Anotações e cartões | Vincule textos a aulas, selecione um trecho e use Destacar trecho selecionado, salve a anotação ou converta em cartão. O destaque é um trecho guardado no caderno; não altera permanentemente a página original. |
| Calendário | Ferramentas → Calendário: planos, revisões e prazos do Radar juntos. Cadastre sessões e confira fontes. A data de conferência é registrada pelo usuário com Conferi a fonte hoje; sem registro, a interface informa isso. O radar não modifica prazos automaticamente. |
| Novidades | Tela na primeira abertura da versão por perfil e acesso permanente por Ferramentas. A versão também aparece no app e em Alt → Ajuda → Sobre PEP. |
| Recuperação | Cópias locais por perfil na abertura, a cada 20 minutos com alterações e antes de editar textos. Até 20 arquivos, mantendo versões recentes e amostras de intervalos anteriores. Prévia e recuperação de um texto sem substituir todo o progresso. A versão atual é protegida antes da restauração. Salve atividades e reinicie o app após recuperar para recarregar todos os editores. |
| Motivação personalizada | Configurações: XP/níveis, missões/conquistas, celebrações, som de conquista e jardim independentes. Dopamina desliga todos. O jardim cresce com atividades distintas e não decai por descanso; desfazer atividades pode ajustar o estágio. |

## Atualização e dados

A instalação mantém o diretório e os perfis anteriores. Novos registros entram na sincronização do progresso. Os arquivos de recuperação são locais e não incluem sessão, senha ou chave Groq. Para proteção fora do computador, exporte backup pelo menu Arquivo. A recuperação é limitada à retenção disponível; não promete histórico permanente de cada tecla.

O instalador e latest.yml precisam estar publicados juntos na release estável. Enviar só o código ao GitHub não atualiza os usuários. Quem já tem uma edição com atualizador instalada recebe o download automático e instala ao sair completamente ou pelo botão Reiniciar e atualizar. Quem tem ZIP antigo instala o setup uma vez.

## Validação

40 testes automatizados, incluindo os novos motores de aprendizagem, compatibilidade dos registros antigos e recuperação isolada por perfil. Testes de interface no Electron exercitam diagnóstico, plano, alternativas, erros, revisão, anotações/cartões, aula, busca, calendário, recuperação, prova, redações, temas e persistência.

Os testes de conta e Groq usam respostas controladas. Não foram enviados e-mails reais nem redações a uma chave de produção nesta entrega. Sincronização entre dois computadores físicos e entrega de e-mail continuam dependendo da configuração e dos limites dos serviços externos.
