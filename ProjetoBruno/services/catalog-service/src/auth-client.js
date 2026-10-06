/**
 * Cliente HTTP Resiliente com Circuit Breaker, Retries com Backoff e Fallback
 * Comunicação Síncrona REST inter-serviços (Catalog -> Auth)
 */

const CircuitState = {
  CLOSED: 'CLOSED',       // Circuito fechado: fluxo normal
  OPEN: 'OPEN',           // Circuito aberto: rejeita chamadas imediatamente (fail-fast)
  HALF_OPEN: 'HALF_OPEN'  // Meio-aberto: sonda de teste para verificar recuperação
};

class ResilientAuthClient {
  constructor(options = {}) {
    this.authBaseUrl = options.baseUrl || process.env.AUTH_SERVICE_URL || 'http://auth-service:4001';
    this.timeoutMs = options.timeoutMs || 1500;                  // Timeout por requisição
    this.failureThreshold = options.failureThreshold || 3;       // Falhas consecutivas para abrir circuito
    this.resetTimeoutMs = options.resetTimeoutMs || 5000;         // Tempo em repouso antes de HALF_OPEN
    this.maxRetries = options.maxRetries || 2;                    // Retentativas em CLOSED

    // Estado interno do Circuit Breaker
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
    this.metrics = {
      totalRequests: 0,
      totalSuccesses: 0,
      totalFailures: 0,
      totalShortCircuited: 0,
      stateChanges: []
    };
  }

  // Transição de estado com registro em log e auditoria
  _transitionTo(newState) {
    const previousState = this.state;
    this.state = newState;
    const transitionRecord = {
      from: previousState,
      to: newState,
      timestamp: new Date().toISOString(),
      failures: this.failureCount
    };
    this.metrics.stateChanges.push(transitionRecord);
    console.warn(`[CircuitBreaker] TRANSIÇÃO DE ESTADO: ${previousState} -> ${newState}`);

    if (newState === CircuitState.OPEN) {
      this.nextAttemptTime = Date.now() + this.resetTimeoutMs;
    } else if (newState === CircuitState.CLOSED) {
      this.failureCount = 0;
      this.nextAttemptTime = null;
    }
  }

  // Executa requisição HTTP com timeout via Fetch API nativa do Node 18+
  async _fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    }
  }

  // Chamada HTTP com retentativas e backoff exponencial
  async _executeWithRetry(fn) {
    let lastError = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        // Não retenta se estiver em HALF_OPEN ou se não restarem tentativas
        if (this.state === CircuitState.HALF_OPEN || attempt === this.maxRetries) {
          break;
        }

        // Backoff exponencial com jitter aleatório para evitar thundering herd
        const backoff = Math.pow(2, attempt) * 150 + Math.random() * 50;
        console.warn(`[AuthClient] Tentativa ${attempt + 1} falhou (${err.message}). Retentando em ${Math.round(backoff)}ms...`);
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
    throw lastError;
  }

  /**
   * Valida um token Bearer contra o auth-service com proteção de Circuit Breaker
   * @param {string} token - Token JWT recebido
   * @returns {Promise<{valid: boolean, user?: object, circuitState: string, isFallback: boolean}>}
   */
  async verifyToken(token) {
    this.metrics.totalRequests++;

    // 1. Checagem do estado do circuito
    const now = Date.now();

    if (this.state === CircuitState.OPEN) {
      if (now >= this.nextAttemptTime) {
        this._transitionTo(CircuitState.HALF_OPEN);
      } else {
        // Circuito aberto: rejeição imediata (Fail-Fast)
        this.metrics.totalShortCircuited++;
        const remainingMs = this.nextAttemptTime - now;
        console.warn(`[CircuitBreaker] Circuito ABERTO. Chamada rejeitada imediatamente (${remainingMs}ms restantes para teste).`);
        
        return this._executeFallback(token, new Error('Circuit Breaker is OPEN'));
      }
    }

    // 2. Execução da chamada HTTP protegida
    try {
      const url = `${this.authBaseUrl}/api/v1/auth/verify`;
      
      const response = await this._executeWithRetry(async () => {
        return await this._fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Caller-Service': 'catalog-service'
          }
        });
      });

      // Trata erros de infraestrutura (5xx) como falha do serviço para o Circuit Breaker
      if (response.status >= 500) {
        throw new Error(`Auth Service retornou erro do servidor HTTP ${response.status}`);
      }

      // Trata respostas normais de negócio (200 OK ou 401 Unauthorized)
      const data = await response.json();

      // Sucesso na comunicação (o serviço Auth respondeu)
      this._handleSuccess();

      return {
        ...data,
        circuitState: this.state,
        isFallback: false
      };
    } catch (err) {
      this._handleFailure(err);
      return this._executeFallback(token, err);
    }
  }

  // Registra sucesso e fecha circuito se estava em HALF_OPEN
  _handleSuccess() {
    this.metrics.totalSuccesses++;
    if (this.state === CircuitState.HALF_OPEN) {
      console.log('[CircuitBreaker] Sonda bem-sucedida! Restaurando circuito para CLOSED.');
      this._transitionTo(CircuitState.CLOSED);
    }
  }

  // Registra falha e abre circuito se atingiu o limiar
  _handleFailure(err) {
    this.metrics.totalFailures++;
    this.failureCount++;
    this.lastFailureTime = new Date().toISOString();

    console.error(`[CircuitBreaker] Falha na comunicação com Auth Service (#${this.failureCount}):`, err.message);

    if (this.state === CircuitState.HALF_OPEN) {
      console.warn('[CircuitBreaker] Sonda falhou em HALF_OPEN. Reabrindo circuito para OPEN.');
      this._transitionTo(CircuitState.OPEN);
    } else if (this.failureCount >= this.failureThreshold && this.state === CircuitState.CLOSED) {
      console.error(`[CircuitBreaker] Limiar de falhas (${this.failureThreshold}) atingido. ABRINDO O CIRCUITO.`);
      this._transitionTo(CircuitState.OPEN);
    }
  }

  // Fallback gracioso (Graceful Degradation)
  _executeFallback(token, originalError) {
    console.warn('[CircuitBreaker] Acionando estratégia de Fallback / Degradação Graciosa.');
    return {
      valid: false,
      circuitState: this.state,
      isFallback: true,
      error: 'Serviço de Autenticação temporariamente indisponível',
      reason: originalError.message,
      recommendation: 'Tente novamente em instantes ou utilize credenciais em cache.'
    };
  }

  // Retorna estatísticas em tempo real para monitoramento
  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      failureThreshold: this.failureThreshold,
      timeoutMs: this.timeoutMs,
      resetTimeoutMs: this.resetTimeoutMs,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime ? new Date(this.nextAttemptTime).toISOString() : null,
      metrics: this.metrics
    };
  }
}

module.exports = new ResilientAuthClient();
