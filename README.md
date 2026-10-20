# PEP — Plataforma de Estudos

Aplicativo de estudos para Windows, versão **2.2.1**. Cursos offline, central de redações, radar de concursos e integração de contas com Supabase.

![Tela inicial de contas](docs/login.png)

## Cursos

| Trilha | Aulas-guia | Questões autorais |
|---|---:|---:|
| Curitiba — Agente Administrativo | 40 | 80 |
| Banco do Brasil — Agente Comercial | 47 | 100 |
| Banco do Brasil — Agente de Tecnologia | 50 | 102 |

Inclui plano de 1 hora por dia, matérias, questões comentadas, simulados, cartões de memória, resumos, biblioteca de fontes, anotações, temas claro/escuro e abertura PEP com som original.

Curitiba: Edital 4/2026, com link para a versão retificada em 15/10/2026, consultada em 19/10/2026. BB: preparação antecipada baseada no edital histórico 2022/001 e provas de 2023. O app não presume um novo edital ou data de nova prova. Questões são autorais de apoio; provas oficiais e livros externos são links.

## Redações, radar e contas

- **Redações:** ENEM, BB, concursos, vestibulares e treino livre; rascunhos com salvamento automático, revisão local, correção com Groq, sugestões reversíveis e histórico por versão.
- **Groq:** chave pessoal protegida pelo Windows. Uso gratuito depende do plano e limites da conta. Nota estimada, sem valor oficial; a revisão local não atribui nota.
- **Radar:** consulta fontes oficiais, detecta novas publicações após uma consulta inicial, organiza etapas e envia lembretes enquanto o app está aberto ou na bandeja. ENEM e autorizações federais são fontes opcionais. Não cobre todos os concursos nem atualiza automaticamente prazos da agenda.
- **Contas:** cadastro, login, confirmação por e-mail, recuperação por código, sessão protegida e progresso separado por usuário. Sincronização com cópia local e tratamento explícito de conflitos.

**A PEP já inclui a conexão pública ao projeto de contas.** Abra o app, escolha **Criar uma conta** e confirme o código recebido por e-mail. Em outro computador Windows, use a mesma versão e conta. O perfil local antigo continua disponível. O arquivo `cloud-defaults.json` contém somente a URL e a chave pública publishable; nenhuma senha ou chave administrativa é distribuída. Uma configuração personalizada existente é preservada. Para administrar ou usar outro projeto, veja [Configurar nuvem](docs/CONFIGURAR-NUVEM.md).

![Central de redações](docs/redacoes.png)

## Usar no Windows

Baixe o pacote na página de [releases](https://github.com/luizhenriquevfernandes2008-ops/plataforma-de-estudos/releases), extraia a pasta inteira e abra `PEP.exe`. Não mova só o executável. O pacote é uma versão de testes sem assinatura digital.

O app inicia em tela cheia. **Esc** sai e **F11** alterna. **Alt** mostra o menu para exportar/importar backup. Consulte o [guia de uso](docs/GUIA-PEP.md).

## Desenvolver e testar

Requisitos: Node.js >=22.13, npm; Windows para gerar o pacote desta distribuição.

```powershell
npm ci
node node_modules/electron/install.js
npm run typecheck
npm test
npm start
```

O comando de instalação do Electron também atende ambientes com scripts do npm desabilitados. Para empacotar:

```powershell
npm run package:win
```

Saída: `dist/PEP-win32-x64/PEP.exe`. O empacotador usa uma lista explícita de arquivos e não inclui testes, perfis, credenciais ou fonte de desenvolvimento. Preserve a pasta de um pacote anterior antes de gerar outro.

## Dados e funcionamento

Os dados ficam em `%APPDATA%\PEP-Estudos-2.1`, nome mantido por compatibilidade. O perfil antigo permanece na raiz; contas usam subpastas próprias. A chave Groq e a sessão são protegidas por `safeStorage`/Windows e não entram no backup ou na sincronização. As senhas dos alunos são tratadas pelo Supabase Auth e não são persistidas pela PEP. Os arquivos de progresso locais não são criptografados; a sessão permanece conectada até sair. Use contas Windows separadas se outras pessoas também acessam o computador.

A sincronização envia progresso, textos e correções ao projeto configurado. As políticas RLS do SQL isolam as contas. Mudanças independentes são combinadas; mudanças concorrentes no mesmo registro exigem escolha. Chaves Groq, cache de notícias e opções locais de notificações não são sincronizados. Backups v1–v4 são aceitos; v4 exporta somente o perfil aberto.

O radar exige internet para consultar fontes; os cursos e a revisão por regras funcionam offline. Notificações dependem do Windows e do app em execução. Não há garantia de armazenamento perpétuo, disponibilidade de terceiros, nota oficial ou aprovação.

## Validação e limites da entrega

Testes automatizados cobrem conteúdo, gravação, isolamento, correção estruturada, chaves, limites de API, extração de publicações, sessões e conflitos. A interface foi exercitada no Electron, incluindo backup e navegação. As cinco fontes do radar responderam à consulta de 19/10/2026.

O projeto Supabase real aceitou a chave pública e informou cadastro por e-mail habilitado com confirmação obrigatória; a leitura de progresso sem login foi negada (HTTP 401). O proprietário executou o SQL e configurou SMTP/templates. **Recebimento real de e-mails, isolamento entre duas contas autenticadas e sincronização entre computadores físicos ainda precisam de teste.** As verificações automatizadas de contas usam respostas simuladas; Groq também não foi testado com chave real. Veja [o estado da versão](docs/STATUS.md).

Principais módulos: `main.cjs` (desktop/API local), `essay-service.cjs` (revisão), `radar.cjs` (fontes), `cloud-auth.cjs` (contas), `cloud-sync.cjs` (sincronização), `src/account-ui.tsx`, `src/writing-studio.tsx`, `src/radar-view.tsx` e `src/course-room.tsx`. Os arquivos antigos de interface foram preservados como referência.
