# Orquestração e Comunicação Resiliente entre Microserviços

Este projeto implementa e orquestra um ecossistema completo de microserviços desacoplados utilizando **Docker Compose** e **Kubernetes (Minikube)**. A arquitetura demonstra comunicação síncrona HTTP/REST protegida por **Circuit Breaker**, mensageria assíncrona orientada a eventos com **RabbitMQ (DLQ/DLX)**, **escalabilidade seletiva**, boas práticas de **versionamento de APIs** e **segurança avançada com JWT e OAuth 2.0**.

---

## 🏗️ Topologia da Arquitetura

```mermaid
flowchart LR
    Client([Clientes / Front-end]) -->|HTTP :8080| GW[API Gateway - Nginx]

    subgraph "Frontend Network (Pública)"
        GW
    end

    subgraph "Backend Network (Privada e Isolada)"
        GW -->|/api/v1/auth/*| Auth[Auth Service<br/>:4001]
        GW -->|/api/v1/products/*| Cat[Catalog Service<br/>:4002<br/>(Escala Seletiva)]
        GW -->|/api/v1/notifications/*| Notif[Notification Service<br/>:4003]

        Cat -.->|Comunicação Síncrona REST<br/>Circuit Breaker & Retries| Auth
        
        Auth ==>|Evento user.*| RMQ[(RabbitMQ<br/>Exchange 'ecommerce.events')]
        Cat ==>|Evento product.*| RMQ
        
        RMQ -->|Fila: notification.events| Notif
        RMQ -.->|Fila DLQ: dead.letter| Notif
    end
```

---

## 📦 Componentes do Ecossistema

1. **API Gateway (`nginx:alpine`)**: Ponto centralizado de entrada (porta pública `8080`), roteamento reverso, CORS, headers de rastreamento e isolamento de redes.
2. **Auth Service (`Node.js/Express`)**: Emissão e assinatura de tokens JWT, cadastro/login de usuários com hash Bcrypt e endpoint de introspecção síncrona de tokens. Emite eventos assíncronos de autenticação.
3. **Catalog Service (`Node.js/Express`)**: Catálogo de produtos e controle de estoque. Consome o `auth-service` via **HTTP REST síncrono protegido por Circuit Breaker (Fail-Fast, Timeout e Fallback)** e publica eventos de negócio no RabbitMQ. Suporta escalabilidade seletiva.
4. **Notification & Audit Service (`Node.js/Express`)**: Consumidor assíncrono com confirmação manual (`ch.ack`), controle de concorrência (`prefetch`) e tratamento de mensagens corrompidas com **Dead Letter Queue (DLQ)**.
5. **Message Broker (`RabbitMQ 3.13`)**: Topic Exchange durável (`ecommerce.events`), Dead Letter Exchange (`ecommerce.dlx`) e painel de gestão web na porta `15672`.

---

## 🚀 Como Executar

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados (ou Minikube / Kubernetes).

---

### Opção 1: Execução com Docker Compose (Recomendado)

1. **Inicialize todos os containers:**
   ```bash
   docker compose up -d --build
   ```

2. **Verifique o status dos serviços e healthchecks:**
   ```bash
   docker compose ps
   ```
   *Todos os 5 serviços passarão para o status `healthy` gradualmente através das sondas de prontidão.*

3. **Acesse as interfaces:**
   - **API Gateway (Ponto de Entrada):** [http://localhost:8080/health](http://localhost:8080/health)
   - **RabbitMQ Management UI:** [http://localhost:15672](http://localhost:15672) *(Login: `guest` / Senha: `guest`)*

---

### Opção 2: Escalabilidade Seletiva com Docker Compose

Para escalar horizontalmente apenas o serviço com maior demanda de requisições (**Catalog Service**) para 3 instâncias:
```bash
docker compose up -d --scale catalog-service=3
```
*O Docker Engine distribuirá o tráfego automaticamente entre as 3 réplicas via DNS Round-Robin sem alterar nenhuma porta do Gateway!*

---

### Opção 3: Execução no Kubernetes (Minikube)

Todos os manifests de produção com `Deployments`, `Services`, `ConfigMaps`, `Secrets`, `Probes` e `HorizontalPodAutoscaler` estão na pasta `k8s/`:

```bash
# 1. Aplicar todos os manifests no cluster Kubernetes
kubectl apply -f k8s/

# 2. Inspecionar pods e réplicas no namespace ecommerce
kubectl get pods,svc,hpa -n ecommerce

# 3. Acompanhar a escala elástica do Catalog Service
kubectl get hpa catalog-service-hpa -n ecommerce --watch
```

---

## 🧪 Scripts de Demonstração e Testes

Disponibilizamos scripts automatizados tanto para **Linux/macOS (Bash)** quanto para **Windows (PowerShell)**:

### 1. Teste de Fluxo Completo Ponta a Ponta
Testa healthchecks, login com JWT, consulta de produtos, criação com autorização síncrona inter-serviços e consumo assíncrono pelo RabbitMQ:
```bash
# No Windows PowerShell:
.\scripts\test-flows.ps1

# No Linux / macOS / Git Bash:
chmod +x ./scripts/*.sh
./scripts/test-flows.sh
```

### 2. Demonstração Interativa do Padrão Circuit Breaker
Demonstra na prática a transição dos 4 estados: `CLOSED` -> `Injeção de Falha` -> `OPEN (Fail-Fast imediato)` -> `HALF_OPEN` -> `CLOSED (Auto-recuperação)`:
```bash
# No Windows PowerShell:
.\scripts\simulate-circuit-breaker.ps1

# No Linux / macOS / Git Bash:
./scripts/simulate-circuit-breaker.sh
```

---

## 📚 Documentação Técnica Aprofundada

Para detalhes completos de design, arquitetura e decisões de engenharia, consulte os documentos na pasta `docs/`:

- 🗺️ [Topologia e Diagramas de Arquitetura](docs/TOPOLOGIA_ARQUITETURA.md): Diagramas detalhados de rede, roteamento de tráfego, isolamento e matriz de portas.
- 🛡️ [Gestão de Falhas e Escalabilidade Seletiva](docs/RESILIENCIA_E_ESCALABILIDADE.md): Teoria e implementação de Circuit Breakers, Timeouts, Exponential Backoff com Jitter, Dead Letter Queues (DLQ) e Kubernetes HPA.
- 🔄 [Boas Práticas de Versionamento de APIs](docs/VERSIONAMENTO_APIS.md): URI vs Header vs Query, ciclo de vida de depreciação RFC 8594 (headers `Deprecation` e `Sunset`) e evolução compatível.
- 🔐 [Segurança Básica: JWT e OAuth 2.0](docs/SEGURANCA_JWT_OAUTH.md): Papéis OAuth2, anatomia do JWT, validação distribuída com chaves assimétricas RS256/JWKS vs HS256 e rotação de tokens.

---

## 📋 Tabela de Referência de Endpoints

Todas as requisições externas devem ser direcionadas ao **API Gateway (`http://localhost:8080`)**:

| Método | Endpoint | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Pública | Healthcheck do API Gateway |
| `POST` | `/api/v1/auth/register` | Pública | Cadastra novo usuário e emite evento `user.registered` |
| `POST` | `/api/v1/auth/login` | Pública | Autentica usuário e devolve Bearer Access Token (JWT) |
| `GET` | `/api/v1/auth/verify` | Bearer JWT | Introspecção e validação síncrona do token |
| `POST` | `/api/v1/auth/simulate-failure` | Pública | Injeta latência ou erro 500 para testes de Circuit Breaker |
| `GET` | `/api/v1/products` | Pública | Lista catálogo de produtos com filtros opcionais |
| `GET` | `/api/v1/products/:id` | Pública | Retorna detalhes do produto por ID |
| `POST` | `/api/v1/products` | Bearer JWT | Cadastra produto (consome Auth via REST síncrono com Circuit Breaker) |
| `PUT` | `/api/v1/products/:id/stock` | Bearer JWT | Atualiza estoque e emite evento `product.stock_updated` |
| `GET` | `/api/v1/products/stats/circuit-breaker` | Pública | Retorna métricas em tempo real do estado do Circuit Breaker |
| `GET` | `/api/v1/notifications/events` | Pública | Lista eventos assíncronos consumidos da fila do RabbitMQ |
