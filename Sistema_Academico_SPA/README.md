# Sistema Acadêmico SPA — versão completa

Projeto acadêmico para NTDWM/IFTO com SPA, dois microserviços, JWT, rotas protegidas, estado global, tratamento de erros, Docker e gerenciamento de usuários.

## Funcionalidades

- Login com JWT
- Dashboard
- Cadastro e listagem de alunos
- Cadastro e listagem de disciplinas
- Matrículas
- Cadastro de usuários com senha
- Confirmação de senha
- Perfis `ADMIN` e `ALUNO`
- Listagem de usuários
- Alteração de senha pelo administrador
- Rotas protegidas
- Tratamento de erros
- Estado global com Context API
- Acesso pela rede local (outro PC)

## Login inicial

- E-mail: `admin@ifto.edu.br`
- Senha: `123456`

## Subir com Docker

Na raiz:

```powershell
Copy-Item .env.example .env
docker compose down -v
docker compose up --build
```

Acesse no PC servidor:

```text
http://localhost:5173
```

Em outro PC da mesma rede, use o IP do computador servidor:

```text
http://IP_DO_SERVIDOR:5173
```

O frontend detecta automaticamente o hostname atual e usa as APIs nas portas 3001 e 3002.

## Usuários x Alunos

`alunos` são registros acadêmicos.

`usuarios` são contas de acesso ao sistema.

Um aluno pode existir sem usuário. Para permitir login, o administrador deve criar uma conta na tela **Usuários**.

## GitHub

```powershell
git add .
git commit -m "Atualiza Sistema Academico SPA com gerenciamento de usuarios"
git push origin main
```
