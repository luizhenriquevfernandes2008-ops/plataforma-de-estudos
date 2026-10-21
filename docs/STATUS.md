# Estado da versão 2.4.0 — 21/10/2026

## Concluído

- PEP com tela de entrada, vinheta sonora, três cursos, tema claro/escuro e tela cheia.
- Central de redações separada: cinco modalidades, salvamento automático, revisão local, integração Groq e histórico por texto.
- Radar com cinco fontes oficiais selecionáveis, agenda, etapas, avisos e bandeja do Windows.
- Cadastro/login Supabase, confirmação e recuperação por código, sessão protegida pelo Windows, cópia local por conta, sincronização e resolução de conflitos.
- Perfil antigo preservado e backups compatíveis com versões anteriores. Chaves privadas e sessões excluídas de backup, sincronização e distribuição. A URL e a chave pública Supabase são incluídas para cadastro imediato.

- Diagnóstico por curso e por conta, confirmação no primeiro uso do computador e aba Estudos próprios com prioridades e treino a partir dos erros.
- Curitiba com 160 questões, sendo 120 de específicos; 34 resumos autorais com exemplos e perguntas.
- Instalador NSIS e atualização automática pelo GitHub: download em segundo plano e instalação no encerramento completo.

- Configurações por perfil: cinco cores, claro/escuro, cinco fontes, tamanhos de leitura, espaçamento, movimentos e som.
- Jornada com XP, níveis, conquistas e missões; opção Dopamina remove os estímulos sem apagar progresso.

## Verificado

- TypeScript sem erros e build de produção.
- 33 testes automatizados: persistência, conteúdo, isolamento, revisão, autenticação, proteção da sessão, mesclagem, conflitos e falhas de rede.
- Interface Electron: tela cheia e áudio, revisão local, sugestões e desfazer, históricos independentes, proteção da chave pelo Windows, agenda, tema, navegação sem perder anotações, bandeja e backup v4.
- Contas na interface com provedor simulado: bloqueio antes do login, troca A → B → A, isolamento e recebimento de progresso de outro dispositivo.
- Consulta real das cinco fontes do radar em 19/10/2026. Fontes externas podem mudar depois dessa verificação.

- Interface 2.3 exercitada com perfil isolado: diagnóstico, geração do plano, prática personalizada, explicação de erro, filtros dos 34 resumos, separação de cursos e bloqueio de reinício com anotação não salva.
- Atualizador testado com eventos simulados: versão elegível, falhas, progresso, intervalo de consultas, cancelamento de saída e proteção de trabalhos pendentes.

- Interface 2.4: rosa claro/escuro, fonte Georgia, leitura ampliada, persistência após recarga, celebração após gravação, Dopamina desligada sem perda de respostas e mudança de tema preservando rascunho.
- Testes adicionais: preferências antigas compatíveis, valores inválidos rejeitados, isolamento por perfil e XP sem duplicação por repetição.

## Ativação externa pendente

O proprietário executou o SQL com sucesso e configurou SMTP Gmail e templates por código. A consulta real em 19/10/2026 confirmou chave válida, e-mail habilitado, cadastro aberto e confirmação obrigatória. A leitura anônima da tabela foi negada com HTTP 401. A versão já traz URL/chave pública; configurações personalizadas anteriores são preservadas. Ainda não foram testados recebimento real de e-mail, isolamento entre usuários autenticados no banco remoto ou comunicação entre dois computadores físicos. Os testes de contas usam respostas simuladas do provedor.

Nenhuma chave Groq real foi fornecida; o fluxo da API foi testado com respostas simuladas. A primeira correção online depende de uma chave válida e dos limites da conta. Revisão local funciona imediatamente.

Notificações nativas dependem da configuração do Windows. O teste da interface verificou as opções e a continuidade na bandeja; não confirma que o sistema exibirá todos os avisos com Não perturbe ligado. A opção de iniciar com Windows está implementada e vem desligada; não foi ativada no computador do usuário durante os testes.

O aplicativo distribuído é Windows x64, sem assinatura digital. Não é uma versão Android/iOS ou um site de estudos. Para acessar a mesma conta em outro dispositivo, use outro computador Windows com a PEP instalada e o mesmo projeto configurado.

## Continuidade

O código e os pacotes ficam salvos localmente. A versão 2.0 e a Prefeitura anterior continuam disponíveis; a versão intermediária 2.1 também foi preservada. A PEP pode consultar fontes e sincronizar enquanto executa, mas não continua desenvolvendo código quando a conversa termina.

Próximo passo: criar uma conta no app e verificar a chegada do código; depois testar recuperação de senha, isolamento entre duas contas reais e acesso à mesma conta em outro computador Windows. Veja [CONFIGURAR-NUVEM.md](CONFIGURAR-NUVEM.md).
