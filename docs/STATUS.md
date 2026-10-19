# Estado da versão 2.2.0 — 19/10/2026

## Concluído

- PEP com tela de entrada, vinheta sonora, três cursos, tema claro/escuro e tela cheia.
- Central de redações separada: cinco modalidades, salvamento automático, revisão local, integração Groq e histórico por texto.
- Radar com cinco fontes oficiais selecionáveis, agenda, etapas, avisos e bandeja do Windows.
- Cadastro/login Supabase, confirmação e recuperação por código, sessão protegida pelo Windows, cópia local por conta, sincronização e resolução de conflitos.
- Perfil antigo preservado e backups compatíveis com versões anteriores. Chaves e sessões excluídas de backup, sincronização e distribuição.

## Verificado

- TypeScript sem erros e build de produção.
- 19 testes automatizados: persistência, conteúdo, isolamento, revisão, autenticação, proteção da sessão, mesclagem, conflitos e falhas de rede.
- Interface Electron: tela cheia e áudio, revisão local, sugestões e desfazer, históricos independentes, proteção da chave pelo Windows, agenda, tema, navegação sem perder anotações, bandeja e backup v4.
- Contas na interface com provedor simulado: bloqueio antes do login, troca A → B → A, isolamento e recebimento de progresso de outro dispositivo.
- Consulta real das cinco fontes do radar em 19/10/2026. Fontes externas podem mudar depois dessa verificação.

## Ativação externa pendente

O proprietário informou que ainda não possui projeto Supabase. O SQL e o guia estão incluídos, mas **não foram implantados em um projeto real**. Não foram testados e-mails reais, isolamento RLS em banco remoto nem comunicação entre dois computadores físicos. A verificação de contas usou respostas simuladas do provedor.

Nenhuma chave Groq real foi fornecida; o fluxo da API foi testado com respostas simuladas. A primeira correção online depende de uma chave válida e dos limites da conta. Revisão local funciona imediatamente.

Notificações nativas dependem da configuração do Windows. O teste da interface verificou as opções e a continuidade na bandeja; não confirma que o sistema exibirá todos os avisos com Não perturbe ligado. A opção de iniciar com Windows está implementada e vem desligada; não foi ativada no computador do usuário durante os testes.

O aplicativo distribuído é Windows x64, sem assinatura digital. Não é uma versão Android/iOS ou um site de estudos. Para acessar a mesma conta em outro dispositivo, use outro computador Windows com a PEP instalada e o mesmo projeto configurado.

## Continuidade

O código e os pacotes ficam salvos localmente. A versão 2.0 e a Prefeitura anterior continuam disponíveis; a versão intermediária 2.1 também foi preservada. A PEP pode consultar fontes e sincronizar enquanto executa, mas não continua desenvolvendo código quando a conversa termina.

Próximo passo externo: seguir [CONFIGURAR-NUVEM.md](CONFIGURAR-NUVEM.md), executar `supabase/setup.sql`, configurar e-mails e validar duas contas reais. Depois disso, conectar o mesmo projeto nos computadores de uso.
