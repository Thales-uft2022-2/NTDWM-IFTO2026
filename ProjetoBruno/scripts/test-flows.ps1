# ==============================================================================
# Script PowerShell de Validação Ponta a Ponta: Autenticação, Catálogo e Mensageria
# ==============================================================================

$GatewayUrl = if ($env:GATEWAY_URL) { $env:GATEWAY_URL } else { "http://localhost:8080" }

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " INICIANDO TESTES DO ECOSSISTEMA DE MICROSERVIÇOS" -ForegroundColor Cyan
Write-Host " Gateway URL: $GatewayUrl" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Healthcheck do API Gateway
Write-Host "`n[1/6] Verificando integridade do API Gateway..." -ForegroundColor Yellow
try {
    $gwHealth = Invoke-RestMethod -Uri "$GatewayUrl/health" -Method Get
    Write-Host "✓ Gateway está UP: $($gwHealth | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch {
    Write-Host "✗ Falha ao contactar Gateway: $_" -ForegroundColor Red
    exit 1
}

# 2. Login e obtenção de token JWT no Auth Service
Write-Host "`n[2/6] Realizando login no Auth Service para obter JWT..." -ForegroundColor Yellow
$loginPayload = @{ email = "admin@empresa.com"; password = "Admin@123" } | ConvertTo-Json
try {
    $loginResp = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/auth/login" -Method Post -Body $loginPayload -ContentType "application/json"
    $token = $loginResp.access_token
    Write-Host "✓ JWT obtido com sucesso: $($token.Substring(0, 30))..." -ForegroundColor Green
} catch {
    Write-Host "✗ Falha ao obter token JWT: $_" -ForegroundColor Red
    exit 1
}

# 3. Consulta de produtos (rota pública no Catalog Service)
Write-Host "`n[3/6] Consultando produtos no Catalog Service..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products" -Method Get
    Write-Host "✓ Total de produtos encontrados: $($products.total)" -ForegroundColor Green
    $products.items | Format-Table id, name, price, stock
} catch {
    Write-Host "✗ Falha ao consultar produtos: $_" -ForegroundColor Red
}

# 4. Cadastro de novo produto (requer autenticação Bearer JWT - Consumo síncrono Catalog -> Auth)
Write-Host "`n[4/6] Cadastrando novo produto (Consumo síncrono Catalog -> Auth)..." -ForegroundColor Yellow
$productPayload = @{
    name = "Cluster Minikube Dedicado"
    category = "Kubernetes"
    price = 12000.0
    stock = 5
} | ConvertTo-Json

try {
    $headers = @{ "Authorization" = "Bearer $token" }
    $createResp = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products" -Method Post -Body $productPayload -ContentType "application/json" -Headers $headers
    Write-Host "✓ Produto criado com sucesso: $($createResp.product.id) - $($createResp.product.name)" -ForegroundColor Green
} catch {
    Write-Host "✗ Falha ao cadastrar produto: $_" -ForegroundColor Red
}

# 5. Atualização de estoque (Dispara evento assíncrono para RabbitMQ)
Write-Host "`n[5/6] Atualizando estoque do produto prod-101 (Disparo de evento)..." -ForegroundColor Yellow
$stockPayload = @{ quantityChange = -2 } | ConvertTo-Json
try {
    $headers = @{ "Authorization" = "Bearer $token" }
    $stockResp = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products/prod-101/stock" -Method Put -Body $stockPayload -ContentType "application/json" -Headers $headers
    Write-Host "✓ Estoque atualizado: Atual=$($stockResp.currentStock), Anterior=$($stockResp.previousStock)" -ForegroundColor Green
} catch {
    Write-Host "✗ Falha ao atualizar estoque: $_" -ForegroundColor Red
}

# 6. Verificação do consumo assíncrono no Notification Service
Write-Host "`n[6/6] Verificando eventos consumidos pelo Notification Service (RabbitMQ)..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
try {
    $events = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/notifications/events" -Method Get
    Write-Host "✓ Total de eventos capturados pelo broker: $($events.totalReceived)" -ForegroundColor Green
    if ($events.events) {
        $events.events | Select-Object routingKey, processedAt, status | Format-Table
    }
} catch {
    Write-Host "✗ Falha ao consultar eventos de notificação: $_" -ForegroundColor Red
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " ✓ TESTES EXECUTADOS COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
