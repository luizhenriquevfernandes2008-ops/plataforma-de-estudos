# Ativar contas e sincronização da PEP

A versão 2.2.1 inclui a conexão pública ao projeto da PEP: alunos podem escolher **Criar uma conta** sem configurar o Supabase. O restante deste guia serve para o proprietário administrar o serviço ou configurar outro projeto. Não existe conta fictícia nem senha universal.

## 1. Criar o projeto e o banco

1. Acesse [Supabase](https://supabase.com/dashboard), entre e crie um projeto. Escolha o plano adequado e guarde a senha administrativa fora do app. Consulte os limites atuais; serviços gratuitos não garantem disponibilidade ou armazenamento para sempre.
2. Abra o **SQL Editor** do projeto. Copie e execute todo o arquivo [supabase/setup.sql](../supabase/setup.sql).
3. Confirme que a tabela `public.pep_progress` tem **Row Level Security habilitada** e as três políticas `pep_own_select`, `pep_own_insert` e `pep_own_update`. Cada usuário autenticado acessa apenas a linha cujo `user_id` corresponde a `auth.uid()`.
4. Em **Authentication**, habilite e-mail e senha e mantenha a confirmação de e-mail. Para permitir cadastro de outras pessoas, configure um serviço SMTP próprio. O envio padrão do Supabase tem limitações e pode restringir destinatários; não basta publicar o aplicativo para liberar e-mails de produção.

## 2. E-mails de confirmação e recuperação

Em **Authentication → Emails → SMTP Settings**, configure primeiro seu provedor SMTP. A interface pode exigir SMTP próprio para liberar a edição dos templates. Para início com baixo volume e sem domínio próprio, Gmail SMTP usa `smtp.gmail.com`, porta `587`, seu Gmail como remetente/usuário e uma senha de app gerada com verificação em duas etapas. Essa senha fica apenas no painel Supabase, nunca no código ou no aplicativo. Gmail tem limites e pode restringir a entrega de e-mails automáticos.

Em **Emails → Templates**, inclua um código em **Confirm sign up** e **Reset password**, na aba **Source**:

```html
<h2>PEP — confirmação de acesso</h2>
<p>Seu código é: <strong>{{ .Token }}</strong></p>
<p>Digite o código na PEP. Se você não solicitou, ignore esta mensagem.</p>
```

No template de recuperação, troque o título para “PEP — recuperação de senha”. O app verifica o código e permite cadastrar uma nova senha. Não precisa de um site intermediário para esse fluxo. Se mantiver links de confirmação, configure também uma Site URL sua; depois de confirmar no navegador, volte à PEP e entre com e-mail e senha.

## 3. Conectar outro projeto (opcional para administradores)

1. No painel do projeto, copie a **Project URL** e a chave **publishable** (`sb_publishable_…`) ou a chave antiga **anon**. Nunca copie `service_role`, `sb_secret_…`, senha do banco ou token administrativo.
2. Na tela inicial da PEP, clique em **Configuração avançada da nuvem**, preencha os dois campos e salve.
3. Clique em **Criar uma conta**, informe e-mail e senha, confirme o código recebido e entre.
4. No segundo computador Windows, instale a PEP, configure **o mesmo projeto** e entre com a mesma conta.

As credenciais administrativas não são necessárias para o uso do app. A senha de cada aluno é enviada ao Supabase Auth por HTTPS para autenticação; a PEP não a grava. A sessão é protegida pelo cofre do Windows. Ao terminar em um computador compartilhado, use **Minha conta → Sair / trocar de conta**.

## 4. Levar o progresso antigo para a conta

Abra o perfil local antigo e exporte um backup pelo menu **Arquivo** (pressione Alt para exibir). Entre na conta desejada, importe o backup e clique em **Minha conta → Sincronizar agora**. A importação é intencional: uma conta nova não recebe automaticamente os dados de outra pessoa.

Sincronizam: progresso dos três cursos, anotações, simulados concluídos, tema, som, redações, correções, agenda e etapas marcadas. Não sincronizam: chave Groq, sessão de autenticação, cache das fontes e configurações locais de notificações/inicialização do Windows. Configure a chave Groq em cada computador onde quiser usá-la.

O app mantém uma cópia local e consulta a nuvem a cada minuto. O primeiro login e novos cadastros precisam de internet. Uma sessão já protegida permite continuar estudando offline; a sessão pode exigir novo login quando expirar ou for revogada. O computador precisa estar ligado e o app aberto ou na bandeja para sincronizar.

Alterações em registros diferentes são combinadas. Quando dois dispositivos alteram o mesmo registro, **Minha conta** mostra ambas as versões e pede uma escolha. A atualização remota não é aplicada enquanto houver edição não salva ou simulado em andamento. Textos em um formulário ainda não salvo não são enviados. Mantenha backups periódicos.

## Verificação antes de usar com outras pessoas

Crie duas contas de teste no projeto real. Salve uma anotação diferente em cada uma e confirme que uma não lê a outra. Use a mesma conta em dois computadores e confira envio, recebimento, conflito de edição, confirmação de e-mail e recuperação de senha. Confira os logs do Supabase e o resultado das políticas RLS. Estes testes reais dependem do projeto e do SMTP; não foram executados na entrega sem esses serviços.

Na entrega 2.2.1, o proprietário executou o SQL e configurou SMTP/templates. A consulta real confirmou cadastro habilitado, confirmação obrigatória e acesso anônimo ao progresso negado. Ainda falta validar o fluxo completo com contas reais. `cloud-defaults.json` distribui apenas a URL e a chave pública do projeto da PEP. Configurações personalizadas continuam locais e têm prioridade; senhas, sessões e chaves administrativas nunca entram no repositório.

Referências: [autenticação por senha](https://supabase.com/docs/guides/auth/passwords), [templates de e-mail](https://supabase.com/docs/guides/auth/auth-email-templates), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) e [chaves públicas](https://supabase.com/docs/guides/getting-started/api-keys).
