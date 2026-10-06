# Microserviço de Usuários com Docker

Projeto da disciplina **Novas Tecnologias e Desenvolvimento Web e Mobile**.

## Objetivo
Implementar um microserviço básico com API REST CRUD e empacotá-lo com Docker.

## Funcionalidade escolhida
**Cadastro de usuários**.

## Tecnologias
- PHP 8.3
- API REST
- SQLite
- HTML + JavaScript
- Docker

## Endpoints CRUD

| Método | Endpoint | Função |
|---|---|---|
| GET | `/api/usuarios` | Listar usuários |
| GET | `/api/usuarios/{id}` | Consultar usuário |
| POST | `/api/usuarios` | Criar usuário |
| PUT | `/api/usuarios/{id}` | Atualizar usuário |
| DELETE | `/api/usuarios/{id}` | Excluir usuário |
| GET | `/health` | Verificar saúde do serviço |

## Exemplos

### Cadastrar
```bash
curl -X POST http://localhost:8080/api/usuarios -H "Content-Type: application/json" -d "{\"nome\":\"Thales Marques\",\"email\":\"thales@example.com\"}"
```

### Listar
```bash
curl http://localhost:8080/api/usuarios
```

### Consultar por ID
```bash
curl http://localhost:8080/api/usuarios/1
```

### Atualizar
```bash
curl -X PUT http://localhost:8080/api/usuarios/1 -H "Content-Type: application/json" -d "{\"nome\":\"Thales Marques Rodrigues\",\"email\":\"thales.rodrigues@example.com\"}"
```

### Excluir
```bash
curl -X DELETE http://localhost:8080/api/usuarios/1
```

## Docker

### Criar a imagem
```bash
docker build -t microservico-usuarios .
```

### Executar
```bash
docker run -d --name usuarios-api -p 8080:8080 microservico-usuarios
```

### Verificar
```bash
docker ps
```

### Logs
```bash
docker logs usuarios-api
```

### Parar
```bash
docker stop usuarios-api
```

### Remover
```bash
docker rm usuarios-api
```

## Demo web
Depois de iniciar o container:

```text
http://localhost:8080/demo.html
```

A interface permite cadastrar, listar, editar e excluir usuários.

## Como outras aplicações podem utilizar a API
Aplicações web, mobile ou outros serviços podem consumir o microserviço por HTTP e receber respostas em JSON. Por exemplo, um aplicativo Flutter, React Native ou uma SPA em React poderia chamar `GET /api/usuarios` para listar usuários.

## Encaixe em uma arquitetura maior
```text
                 API Gateway
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
 Serviço de     Serviço de     Serviço de
 Usuários       Produtos       Pedidos
       |             |             |
       v             v             v
 Banco de       Banco de       Banco de
 Usuários       Produtos       Pedidos
```

O serviço de usuários cuida apenas do domínio de usuários. Outros serviços podem ser implantados e escalados independentemente.

## Benefícios do Docker
- **Isolamento:** dependências ficam dentro do container.
- **Portabilidade:** a imagem pode rodar em qualquer ambiente com Docker.
- **Padronização:** todos executam o mesmo ambiente.
- **Implantação independente:** o serviço pode ser atualizado sem precisar alterar outros serviços.

## Estrutura
```text
microservico_usuarios_docker/
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
├── data/
├── src/
│   └── database.php
└── public/
    ├── index.php
    ├── router.php
    └── demo.html
```

## Roteiro de apresentação
1. Mostrar o código da API.
2. Mostrar o `Dockerfile`.
3. Executar `docker build -t microservico-usuarios .`.
4. Executar `docker run -d --name usuarios-api -p 8080:8080 microservico-usuarios`.
5. Mostrar `docker ps`.
6. Abrir `http://localhost:8080/demo.html`.
7. Demonstrar cadastro, consulta, edição e exclusão.
8. Abrir `http://localhost:8080/api/usuarios` para mostrar a resposta JSON.
9. Explicar isolamento, portabilidade e o papel do microserviço em uma arquitetura maior.
