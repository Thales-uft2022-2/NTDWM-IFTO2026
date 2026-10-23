# Fluxo JWT

1. Usuário envia e-mail e senha para `POST /auth/login`.
2. Serviço de usuários valida credenciais.
3. Serviço gera JWT com `id`, `nome`, `email` e `perfil`.
4. Frontend salva sessão no estado global/localStorage.
5. Axios envia `Authorization: Bearer TOKEN`.
6. Os microserviços validam token.
7. Operações administrativas também verificam `perfil === ADMIN`.
