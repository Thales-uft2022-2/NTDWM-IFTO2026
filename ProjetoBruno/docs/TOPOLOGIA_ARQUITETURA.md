# Topologia da Solução e Arquitetura de Microserviços

Este documento apresenta a topologia completa da solução orquestrada, detalhando o fluxo de dados síncrono e assíncrono, a segregação de redes, o balanceamento de carga e a organização dos containers.

---

## 1. Diagrama de Topologia da Arquitetura

O diagrama abaixo ilustra a arquitetura lógica e física do ecossistema, destacando as fronteiras de rede pública e privada, as chamadas síncronas REST e os fluxos assíncronos orientados a eventos via RabbitMQ.

```mermaid
flowchart TB
    subgraph Clients["Clientes Externos"]
        Browser["SPA / Navegador Web"]
        Mobile["Aplicativo Mobile"]
        ExternalSys["Sistemas Externos"]
    end

    subgraph Host["Host Docker / Cluster Kubernetes"]
        subgraph PublicNet["Rede Pública (frontend_net)"]
            Gateway["API Gateway (Nginx)<br/>Porta Externa: 8080<br/>Porta Interna: 80"]
        end

        subgraph PrivateNet["Rede Privada de Microserviços (backend_net)"]
            subgraph AuthServiceCluster["Auth Service"]
                Auth1["Auth Service (Instância 1)<br/>Porta: 4001<br/>Emissor JWT & Introspecção"]
            end

            subgraph CatalogServiceCluster["Catalog Service (Escalabilidade Seletiva)"]
                Cat1["Catalog Service (Réplica 1)<br/>Porta: 4002<br/>Circuit Breaker Ativo"]
                Cat2["Catalog Service (Réplica 2)<br/>Porta: 4002<br/>Circuit Breaker Ativo"]
                Cat3["Catalog Service (Réplica 3)<br/>Porta: 4002<br/>Circuit Breaker Ativo"]
            end

            subgraph NotificationCluster["Notification & Audit Service"]
                Notif1["Notification Service<br/>Porta: 4003<br/>Consumidor de Eventos"]
            end

            subgraph MessageBroker["Message Broker (RabbitMQ)"]
                Exchange["Topic Exchange<br/>'ecommerce.events'"]
                DLX["Dead Letter Exchange (DLX)<br/>'ecommerce.dlx'"]
                QueueNotif["Fila: notification.events<br/>Routing: product.*, user.*"]
                QueueDLQ["Fila DLQ: ecommerce.events.dlq<br/>Routing: dead.letter"]
                RabbitUI["RabbitMQ Management UI<br/>Porta: 15672"]
            end

            subgraph Storage["Camada de Persistência"]
                VolRabbit[("Volume: rabbitmq_data")]
            end
        end
    end

    %% Fluxo de Clientes para Gateway
    Browser -->|HTTP Requests| Gateway
    Mobile -->|HTTP Requests| Gateway
    ExternalSys -->|HTTP Requests| Gateway

    %% Roteamento do Gateway
    Gateway -->|"/api/v1/auth/*"| Auth1
    Gateway -->|"/api/v1/products/* (Round-Robin DNS)"| Cat1
    Gateway -->|"/api/v1/products/*"| Cat2
    Gateway -->|"/api/v1/products/*"| Cat3
    Gateway -->|"/api/v1/notifications/*"| Notif1

    %% Comunicação Síncrona REST (Catalog -> Auth)
    Cat1 -.->|"Chamada REST Síncrona (com Circuit Breaker)<br/>GET /api/v1/auth/verify"| Auth1
    Cat2 -.->|"Chamada REST Síncrona (com Circuit Breaker)<br/>GET /api/v1/auth/verify"| Auth1
    Cat3 -.->|"Chamada REST Síncrona (com Circuit Breaker)<br/>GET /api/v1/auth/verify"| Auth1

    %% Comunicação Assíncrona (Producers -> RabbitMQ)
    Auth1 ==>|"Evento: user.registered, user.logged_in"| Exchange
    Cat1 ==>|"Evento: product.created, product.stock_updated"| Exchange
    Cat2 ==>|"Evento: product.created, product.stock_updated"| Exchange
    Cat3 ==>|"Evento: product.created, product.stock_updated"| Exchange

    %% Roteamento no RabbitMQ
    Exchange -->|Binding 'product.*' & 'user.*'| QueueNotif
    QueueNotif -.->|NACK com requeue=false (Poison Pill)| DLX
    DLX -->|Routing 'dead.letter'| QueueDLQ

    %% Consumo Assíncrono
    QueueNotif -->|"Consumo Assíncrono (ACK manual)"| Notif1
    QueueDLQ -->|"Auditoria de Mensagens Mortas"| Notif1

    %% Persistência
    Exchange -.-> VolRabbit
    QueueNotif -.-> VolRabbit
    QueueDLQ -.-> VolRabbit
```

---

## 2. Segregação e Isolamento de Redes

A segurança de perímetro e a contenção de tráfego são garantidas por uma arquitetura de duas redes (*Dual-Network Pattern*):

| Rede Docker | Finalidade | Serviços Conectados | Exposição Externa |
| :--- | :--- | :--- | :--- |
| **`frontend_net`** | Tráfego de borda e roteamento reverso | `api-gateway`, `auth-service`, `catalog-service`, `notification-service` | Apenas porta **8080** do Gateway |
| **`backend_net`** | Tráfego interno de alta confiabilidade e mensageria | `auth-service`, `catalog-service`, `notification-service`, `rabbitmq` | **Isolada** (sem acesso direto da internet) |

### Benefícios dessa Topologia:
1. **Defesa em Profundidade**: O RabbitMQ e as portas internas dos microserviços (4001, 4002, 4003) não são diretamente acessíveis pelo mundo exterior. Somente requisições filtradas e roteadas pelo API Gateway chegam aos serviços.
2. **Prevenção de Ataques Laterais**: Caso o Gateway sofra comprometimento, ele não tem acesso direto à rede de mensageria nem às portas de banco/broker, pois o Gateway pertence exclusivamente à `frontend_net`.

---

## 3. Matriz de Serviços e Portas

| Serviço | Container Name | Imagem Base | Porta Interna | Porta Exposta no Host | Protocolo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API Gateway** | `ecommerce-api-gateway` | `nginx:alpine` | `80` | `8080` | HTTP / Reverse Proxy |
| **Auth Service** | `ecommerce-auth-service` | `node:20-alpine` | `4001` | *Nenhuma (Interna)* | HTTP REST + AMQP |
| **Catalog Service** | `ecommerce-catalog-service` | `node:20-alpine` | `4002` | *Nenhuma (Interna)* | HTTP REST + AMQP |
| **Notification Service** | `ecommerce-notification-service` | `node:20-alpine` | `4003` | *Nenhuma (Interna)* | HTTP REST + AMQP |
| **RabbitMQ** | `ecommerce-rabbitmq` | `rabbitmq:3.13-management-alpine` | `5672`, `15672` | `5672`, `15672` | AMQP / HTTP Management |

---

## 4. Fluxo Detalhado das Requisições

### 4.1. Fluxo Síncrono: Cadastro de Produto com Validação de Token
1. O cliente envia uma requisição `POST /api/v1/products` para o Gateway na porta `8080` com o cabeçalho `Authorization: Bearer <jwt>`.
2. O Gateway balanceia a requisição via DNS interno para uma das réplicas ativas do `catalog-service`.
3. O `catalog-service` intercepta a requisição e aciona o seu **`ResilientAuthClient`**:
   - Se o circuito estiver `CLOSED`: faz chamada HTTP síncrona `GET http://auth-service:4001/api/v1/auth/verify`.
   - O `auth-service` decodifica e valida a assinatura do JWT, retornando o perfil e permissões do usuário em ~5ms.
   - O `catalog-service` persiste o produto e retorna status `201 Created`.
4. Se o `auth-service` estiver instável ou fora do ar:
   - O Circuit Breaker do `catalog-service` dispara timeout (1500ms). Após 3 falhas consecutivas, o circuito muda para `OPEN`.
   - Novas requisições sofrem rejeição imediata (*fail-fast*) com status `503 Service Unavailable` e cabeçalho `X-Circuit-Breaker-State: OPEN`, sem sobrecarregar a rede nem consumir recursos da thread pool.

### 4.2. Fluxo Assíncrono: Notificação e Auditoria de Estoque
1. O `catalog-service`, após criar o produto ou atualizar estoque (`PUT /api/v1/products/:id/stock`), empacota um payload JSON com timestamp, ID do produto e usuário responsável.
2. O `catalog-service` publica o evento na Topic Exchange `ecommerce.events` com routing key `product.stock_updated`.
3. O RabbitMQ avalia as bindings e entrega uma cópia da mensagem para a fila durável `notification.events`.
4. O `notification-service`, que mantém conexão de consumo persistente com QoS `prefetch=5`, recebe a mensagem.
5. O `notification-service` processa o evento de forma assíncrona (gerando registro de auditoria ou alerta de estoque baixo) e envia um `ack` explícito para o RabbitMQ.
6. **Resiliência a Mensagens Inválidas (DLQ)**: Se a mensagem contiver dados corrompidos que impeçam o parse, o consumidor emite `nack(msg, false, false)`, e o RabbitMQ a transfere automaticamente para a Dead Letter Queue (`ecommerce.events.dlq`) para posterior investigação, evitando loops infinitos de reprocessamento.
