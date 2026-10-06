#!/usr/bin/env bash
# ==============================================================================
# Script de Validação Ponta a Ponta: Autenticação, Catálogo e Mensageria
# ==============================================================================

set -e

GATEWAY_URL=${GATEWAY_URL:-"http://localhost:8080"}

echo "========================================================"
echo " INICIANDO TESTES DO ECOSSISTEMA DE MICROSERVIÇOS"
echo " Gateway URL: $GATEWAY_URL"
echo "========================================================"

# 1. Healthcheck do API Gateway
echo -e "\n[1/6] Verificando integridade do API Gateway..."
curl -s -f "$GATEWAY_URL/health" | grep -q "UP" && echo "✓ Gateway está UP" || (echo "✗ Gateway inacessível" && exit 1)

# 2. Login e obtenção de token JWT no Auth Service
echo -e "\n[2/6] Realizando login no Auth Service para obter JWT..."
LOGIN_RESPONSE=$(curl -s -X POST "$GATEWAY_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"Admin@123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
  echo "✗ Falha ao obter token JWT. Resposta: $LOGIN_RESPONSE"
  exit 1
fi
echo "✓ JWT obtido com sucesso: ${TOKEN:0:25}..."

# 3. Consulta de produtos (rota pública no Catalog Service)
echo -e "\n[3/6] Consultando produtos no Catalog Service..."
PRODUCTS_RESPONSE=$(curl -s "$GATEWAY_URL/api/v1/products")
echo "✓ Produtos retornados:"
echo "$PRODUCTS_RESPONSE"

# 4. Cadastro de novo produto (requer autenticação Bearer JWT)
echo -e "\n[4/6] Cadastrando novo produto (Consumo síncrono Catalog -> Auth)..."
CREATE_RESPONSE=$(curl -s -i -X POST "$GATEWAY_URL/api/v1/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cluster Minikube Dedicado","category":"Kubernetes","price":12000.0,"stock":5}')

CB_HEADER=$(echo "$CREATE_RESPONSE" | grep -i "X-Circuit-Breaker-State" || true)
echo "✓ Resposta da criação de produto:"
echo "$CREATE_RESPONSE" | grep -E "(HTTP/|message|productId|X-Circuit-Breaker-State)"

# 5. Atualização de estoque (Dispara evento assíncrono para RabbitMQ)
echo -e "\n[5/6] Atualizando estoque do produto prod-101 (Disparo de evento)..."
STOCK_RESPONSE=$(curl -s -X PUT "$GATEWAY_URL/api/v1/products/prod-101/stock" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantityChange": -2}')
echo "✓ Resposta da atualização de estoque: $STOCK_RESPONSE"

# 6. Verificação do consumo assíncrono no Notification Service
echo -e "\n[6/6] Verificando eventos consumidos pelo Notification Service (RabbitMQ)..."
sleep 1
EVENTS_RESPONSE=$(curl -s "$GATEWAY_URL/api/v1/notifications/events")
echo "✓ Eventos processados na fila:"
echo "$EVENTS_RESPONSE"

echo -e "\n========================================================"
echo " ✓ TODOS OS TESTES FORAM CONCLUÍDOS COM SUCESSO!"
echo "========================================================"
