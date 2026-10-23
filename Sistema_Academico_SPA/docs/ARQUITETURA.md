# Arquitetura

- SPA React/Vite na porta 5173.
- Microserviço de usuários na porta 3001.
- Microserviço acadêmico na porta 3002.
- MySQL na porta 3306.
- JWT compartilhado entre os backends.
- Context API para estado global de autenticação.

A tela Usuários é protegida para `ADMIN`.
