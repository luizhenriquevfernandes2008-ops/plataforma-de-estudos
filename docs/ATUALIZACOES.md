# Publicar atualizações da PEP

Usuários do ZIP antigo precisam instalar o novo instalador uma vez. Depois disso, o app instalado consulta o repositório público, baixa versões superiores estáveis e verifica o SHA-512 do instalador. Não aceita prereleases nem downgrade. O instalador não possui certificado de assinatura digital.

1. Altere a versão com npm version patch --no-git-tag-version (ou minor para recursos), mantendo package.json e lock consistentes.
2. Execute npm run typecheck, npm test e npm run package:win no Windows. Teste a interface e preserve a versão anterior.
3. Revise e envie o código ao main. Crie uma release **em rascunho**, tag v seguida da mesma versão, apontando para esse commit.
4. Anexe os três arquivos gerados juntos: instalador .exe, .exe.blockmap e latest.yml. Não edite o hash do manifesto nem troque somente o executável.
5. Confira uploads, versão e hashes; publique como release normal. O rascunho impede que usuários recebam uma publicação incompleta. Nunca reutilize uma versão já publicada; use uma versão maior para corrigir problemas.

Uma alteração de código enviada apenas ao GitHub não atualiza o aplicativo: é necessário publicar o novo instalador e manifesto. Nenhuma chave administrativa, senha SMTP, token GitHub ou chave Groq deve entrar no código ou nos anexos. A URL e chave publishable do Supabase são públicas por definição.

A PEP verifica após 20 segundos e a cada quatro horas aberta. Download automático; instalação ao sair completamente ou ao solicitar reinício. Modo portátil/desenvolvimento fica desativado. Dados permanecem em %APPDATA%\PEP-Estudos-2.1. Salve um backup antes de testes de migração.

Referência: https://www.electron.build/v26/docs/features/auto-update/
