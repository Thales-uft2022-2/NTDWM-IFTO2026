# Sistema Financeiro Pessoal — NTDWB

Aplicação acadêmica com React, Node.js, Express, MySQL e Docker.

## Requisitos
- Docker Desktop com Docker Compose
- Git (opcional)
- Navegador atualizado

## Executar com Docker
1. Copie `.env.example` para `.env`.
2. Para uso local, os valores de exemplo permitem iniciar o projeto. Não use esses segredos em produção.
3. Na raiz do projeto, execute:

```bash
docker compose up --build
```

4. Acesse `http://localhost:8080`.
5. Verifique a API em `http://localhost:8080/api/health`.

Para encerrar, use `Ctrl+C` e depois `docker compose down`. Os dados permanecem no volume `mysql_data`. Para apagar também os dados, execute `docker compose down -v` (operação destrutiva).

## Executar sem Docker (desenvolvimento)
É necessário ter Node.js 20+ e um servidor MySQL configurado. Crie o banco e as tabelas executando `backend/database.sql`; configure as variáveis de ambiente do back-end. Em `backend/`, execute `npm install` e `npm start`. Em outro terminal, entre em `frontend/`, execute `npm install` e `npm run dev`. Defina `VITE_API_URL=http://localhost:3000/api` no ambiente do Vite antes de iniciar o front-end.

## Endpoints
- `GET /api/health`
- `POST /api/auth/cadastro` — `{ "nome": "Ana", "email": "ana@example.com", "senha": "senha123" }`
- `POST /api/auth/login` — `{ "email": "ana@example.com", "senha": "senha123" }`
- `GET /api/transacoes` — exige token Bearer
- `POST /api/transacoes` — exige token Bearer; exemplo: `{ "tipo": "despesa", "descricao": "Mercado", "categoria": "Alimentação", "valor": 125.50, "data": "2026-10-22" }`
- `DELETE /api/transacoes/:id` — exige token Bearer

## Segurança e implantação
Antes de publicar, defina um `JWT_SECRET` longo e aleatório, senhas fortes de banco, HTTPS e origens CORS específicas. Não envie `.env` ao Git. Para publicar, hospede o front-end e a API em serviços compatíveis com Docker/Node.js e configure um MySQL gerenciado com acesso de rede restrito. Ajuste `VITE_API_URL` ou a configuração do proxy conforme os domínios públicos escolhidos. O arquivo Compose é voltado ao desenvolvimento/demonstração; a publicação exige configurar separadamente a rede e as variáveis do provedor.

## Documentação
- `docs/arquitetura.md`
- `docs/relatorio.md`

## Escopo acadêmico
A implementação fornece cadastro, login, dashboard e CRUD básico de transações. Teste todos os fluxos antes da apresentação e complete o relatório com resultados reais da execução.
