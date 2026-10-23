require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const authRoutes = require("./routes/auth");
const transacoesRoutes = require("./routes/transacoes");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", servico: "sistema-financeiro-api", banco: "conectado" });
  } catch {
    res.status(503).json({ status: "erro", banco: "indisponível" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/transacoes", transacoesRoutes);

app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada." }));
app.use((erro, _req, res, _next) => {
  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

async function iniciar() {
  // Aguarda o banco estar pronto; o Compose também define healthcheck.
  for (let tentativa = 1; tentativa <= 15; tentativa++) {
    try {
      await pool.query("SELECT 1");
      app.listen(PORT, "0.0.0.0", () => console.log(`API disponível na porta ${PORT}`));
      return;
    } catch (erro) {
      console.log(`Aguardando MySQL (${tentativa}/15)...`);
      if (tentativa === 15) {
        console.error(erro);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
iniciar();
