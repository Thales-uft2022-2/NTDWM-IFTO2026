const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function requisicao(caminho, opcoes = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(opcoes.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });
  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || "Não foi possível concluir a operação.");
  return dados;
}

export const api = {
  cadastro: (dados) => requisicao("/auth/cadastro", { method: "POST", body: JSON.stringify(dados) }),
  login: (dados) => requisicao("/auth/login", { method: "POST", body: JSON.stringify(dados) }),
  listar: () => requisicao("/transacoes"),
  criar: (dados) => requisicao("/transacoes", { method: "POST", body: JSON.stringify(dados) }),
  excluir: (id) => requisicao(`/transacoes/${id}`, { method: "DELETE" })
};
