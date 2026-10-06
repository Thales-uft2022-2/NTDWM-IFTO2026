#!/usr/bin/env bash
# ==============================================================================
# Script de Demonstração Interativa do Padrão Circuit Breaker
# Demonstra os estados: CLOSED -> OPEN (Fail-Fast) -> HALF-OPEN -> CLOSED
# ==============================================================================

set -e

GATEWAY_URL=${GATEWAY_URL:-"http://localhost:8080"}

echo "======================================================================"
echo " DEMONSTRAÇÃO PRÁTICA DO CIRCUIT BREAKER (Catalog -> Auth Service)"
echo " Gateway URL: $GATEWAY_URL"
echo "======================================================================"

# 1. Login para obter token válido
echo -e "\n[Passo 1] Obtendo token JWT inicial..."
LOGIN_JSON=$(curl -s -X POST "$GATEWAY_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"Admin@123"}')
TOKEN=$(echo "$LOGIN_JSON" | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
echo "✓ Token obtido."

# 2. Verifica estado inicial do Circuit Breaker (esperado: CLOSED)
echo -e "\n[Passo 2] Estado atual do Circuit Breaker:"
curl -s "$GATEWAY_URL/api/v1/products/stats/circuit-breaker" | grep -o '"state":"[^"]*'

# 3. Indução de falha: Configura Auth Service para simular Timeout (latência de 3000ms > timeout de 1500ms do Catalog)
echo -e "\n[Passo 3] Injetando falha no Auth Service (Modo Timeout: 3000ms)..."
curl -s -X POST "$GATEWAY_URL/api/v1/auth/simulate-failure" \
  -H "Content-Type: application/json" \
  -d '{"mode":"timeout","delayMs":3000}'
echo "✓ Simulação de latência ativada no Auth Service."

# 4. Dispara requisições para atingir o limiar de 3 falhas consecutivas
echo -e "\n[Passo 4] Enviando chamadas para provocar o disparo do Circuit Breaker..."
for i in 1 2 3; do
  echo "--- Enviando tentativa #$i ---"
  curl -s -w "\nHTTP Status: %{http_code} | Tempo Total: %{time_total}s\n" \
    -X POST "$GATEWAY_URL/api/v1/products" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Teste Falha $i\",\"category\":\"Teste\",\"price\":100,\"stock\":1}"
done

# 5. Verifica que o circuito agora está ABERTO (OPEN)
echo -e "\n[Passo 5] Verificando se o circuito ABRIU (OPEN):"
curl -s "$GATEWAY_URL/api/v1/products/stats/circuit-breaker" | grep -o '"state":"[^"]*'

# 6. Teste de Fail-Fast: Requisição com circuito aberto deve retornar IMEDIATAMENTE (sem gastar tempo de timeout)
echo -e "\n[Passo 6] Testando Fail-Fast com circuito ABERTO (deve retornar imediatamente com HTTP 503):"
curl -s -i -X POST "$GATEWAY_URL/api/v1/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste Fail-Fast","category":"Teste","price\":100,"stock\":1}' | head -n 15

# 7. Restaura saúde do Auth Service
echo -e "\n[Passo 7] Restaurando Auth Service para operação normal..."
curl -s -X POST "$GATEWAY_URL/api/v1/auth/simulate-failure" \
  -H "Content-Type: application/json" \
  -d '{"mode":"normal"}'

# 8. Aguarda período de repouso do circuito (5 segundos) para transição para HALF-OPEN
echo -e "\n[Passo 8] Aguardando 6 segundos para expiração do timeout do Circuit Breaker..."
sleep 6

# 9. Requisição de sonda (Succeeds e fecha o circuito de volta para CLOSED)
echo -e "\n[Passo 9] Enviando requisição de sonda para restauração do circuito..."
curl -s -i -X POST "$GATEWAY_URL/api/v1/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto Pós-Recuperação","category":"Infra","price\":500,"stock\":10}' | head -n 15

# 10. Verifica estado final: CLOSED
echo -e "\n[Passo 10] Estado final do Circuit Breaker (esperado: CLOSED):"
curl -s "$GATEWAY_URL/api/v1/products/stats/circuit-breaker" | grep -o '"state":"[^"]*'

echo -e "\n======================================================================"
echo " ✓ DEMONSTRAÇÃO DO CIRCUIT BREAKER CONCLUÍDA COM SUCESSO!"
echo "======================================================================"
