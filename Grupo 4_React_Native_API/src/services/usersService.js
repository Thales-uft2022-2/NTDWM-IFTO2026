import { USERS_ENDPOINT, REQUEST_TIMEOUT_MS } from '../config/api';

export async function fetchUsers() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(USERS_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`A API respondeu com HTTP ${response.status}.`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('A resposta da API não está no formato esperado.');
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('A requisição demorou demais. Tente novamente.');
    }
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar à API. Verifique a internet e o endereço do servidor.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
