# ==============================================================================
# Script PowerShell de Demonstração Interativa do Padrão Circuit Breaker
# Demonstra os estados: CLOSED -> OPEN (Fail-Fast) -> HALF-OPEN -> CLOSED
# ==============================================================================

$GatewayUrl = if ($env:GATEWAY_URL) { $env:GATEWAY_URL } else { "http://localhost:8080" }

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " DEMONSTRAÇÃO PRÁTICA DO CIRCUIT BREAKER (Catalog -> Auth Service)" -ForegroundColor Cyan
Write-Host " Gateway URL: $GatewayUrl" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Login para obter token válido
Write-Host "`n[Passo 1] Obtendo token JWT inicial..." -ForegroundColor Yellow
$loginPayload = @{ email = "admin@empresa.com"; password = "Admin@123" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/auth/login" -Method Post -Body $loginPayload -ContentType "application/json"
$token = $loginResp.access_token
Write-Host "✓ Token obtido." -ForegroundColor Green

# 2. Verifica estado inicial do Circuit Breaker
Write-Host "`n[Passo 2] Estado atual do Circuit Breaker:" -ForegroundColor Yellow
$stats = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products/stats/circuit-breaker" -Method Get
Write-Host "Estado: $($stats.state) | Falhas: $($stats.failureCount)" -ForegroundColor Green

# 3. Indução de falha: Configura Auth Service para simular Timeout (3000ms > 1500ms do Catalog)
Write-Host "`n[Passo 3] Injetando falha no Auth Service (Modo Timeout: 3000ms)..." -ForegroundColor Yellow
$failPayload = @{ mode = "timeout"; delayMs = 3000 } | ConvertTo-Json
Invoke-RestMethod -Uri "$GatewayUrl/api/v1/auth/simulate-failure" -Method Post -Body $failPayload -ContentType "application/json" | Out-Null
Write-Host "✓ Latência de 3000ms ativada no Auth Service." -ForegroundColor Green

# 4. Dispara 3 requisições para atingir o limiar de falhas
Write-Host "`n[Passo 4] Enviando chamadas para provocar o disparo do Circuit Breaker..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }
for ($i = 1; $i -le 3; $i++) {
    Write-Host "--- Enviando tentativa #$i ---" -ForegroundColor DarkGray
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $prodPayload = @{ name = "Teste Falha $i"; category = "Teste"; price = 100; stock = 1 } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products" -Method Post -Body $prodPayload -ContentType "application/json" -Headers $headers | Out-Null
    } catch {
        $sw.Stop()
        Write-Host "Tentativa #$i falhou em $($sw.ElapsedMilliseconds)ms (Timeout/Erro capturado)" -ForegroundColor Red
    }
}

# 5. Verifica se o circuito agora está ABERTO
Write-Host "`n[Passo 5] Verificando estado após 3 falhas:" -ForegroundColor Yellow
$statsAfter = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products/stats/circuit-breaker" -Method Get
Write-Host "Estado do Circuito: $($statsAfter.state)" -ForegroundColor Red

# 6. Teste de Fail-Fast
Write-Host "`n[Passo 6] Testando Fail-Fast com circuito ABERTO (deve responder instantaneamente com 503):" -ForegroundColor Yellow
$swFast = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $prodFast = @{ name = "Teste Fail-Fast"; category = "Teste"; price = 100; stock = 1 } | ConvertTo-Json
    Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products" -Method Post -Body $prodFast -ContentType "application/json" -Headers $headers | Out-Null
} catch {
    $swFast.Stop()
    Write-Host "✓ Chamada rejeitada imediatamente em $($swFast.ElapsedMilliseconds)ms! Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
}

# 7. Restaura saúde do Auth Service
Write-Host "`n[Passo 7] Restaurando Auth Service para operação normal..." -ForegroundColor Yellow
$restorePayload = @{ mode = "normal" } | ConvertTo-Json
Invoke-RestMethod -Uri "$GatewayUrl/api/v1/auth/simulate-failure" -Method Post -Body $restorePayload -ContentType "application/json" | Out-Null
Write-Host "✓ Auth Service restaurado ao estado normal." -ForegroundColor Green

# 8. Aguarda período de repouso (6 segundos) para HALF-OPEN
Write-Host "`n[Passo 8] Aguardando 6 segundos para expiração do timeout do Circuit Breaker..." -ForegroundColor Yellow
Start-Sleep -Seconds 6

# 9. Requisição de sonda (Recuperação)
Write-Host "`n[Passo 9] Enviando requisição de sonda para restauração do circuito..." -ForegroundColor Yellow
$probePayload = @{ name = "Produto Pós-Recuperação"; category = "Infra"; price = 500; stock = 10 } | ConvertTo-Json
$probeResp = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products" -Method Post -Body $probePayload -ContentType "application/json" -Headers $headers
Write-Host "✓ Requisição de sonda bem-sucedida: $($probeResp.product.id) criado." -ForegroundColor Green

# 10. Verifica estado final: CLOSED
Write-Host "`n[Passo 10] Estado final do Circuit Breaker:" -ForegroundColor Yellow
$statsFinal = Invoke-RestMethod -Uri "$GatewayUrl/api/v1/products/stats/circuit-breaker" -Method Get
Write-Host "Estado Final: $($statsFinal.state) | Circuito totalmente recuperado!" -ForegroundColor Green

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host " ✓ DEMONSTRAÇÃO DO CIRCUIT BREAKER FINALIZADA COM SUCESSO!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
