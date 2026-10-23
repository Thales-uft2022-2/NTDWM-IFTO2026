const express = require("express");
const pool = require("../config/database");
const autenticar = require("../middleware/auth");

const router = express.Router();
router.use(autenticar);

router.get("/", async (req, res) => {
  try {
    const [linhas] = await pool.execute(
      `SELECT id, tipo, descricao, categoria, valor, DATE_FORMAT(data, '%Y-%m-%d') AS data, criado_em
       FROM transacoes WHERE usuario_id = ? ORDER BY data DESC, id DESC`,
      [req.usuario.id]
    );
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao listar transações." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { tipo, descricao, categoria, valor, data } = req.body;
    const valorNumero = Number(valor);

    if (!["receita", "despesa"].includes(tipo)) {
      return res.status(400).json({ erro: "O tipo deve ser receita ou despesa." });
    }
    if (!descricao || !categoria || !Number.isFinite(valorNumero) || valorNumero <= 0 || !data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return res.status(400).json({ erro: "Informe descrição, categoria, valor positivo e data válida (AAAA-MM-DD)." });
    }

    const [resultado] = await pool.execute(
      "INSERT INTO transacoes (usuario_id, tipo, descricao, categoria, valor, data) VALUES (?, ?, ?, ?, ?, ?)",
      [req.usuario.id, tipo, descricao.trim(), categoria.trim(), valorNumero, data]
    );
    const [linhas] = await pool.execute(
      "SELECT id, tipo, descricao, categoria, valor, DATE_FORMAT(data, '%Y-%m-%d') AS data FROM transacoes WHERE id = ? AND usuario_id = ?",
      [resultado.insertId, req.usuario.id]
    );
    res.status(201).json(linhas[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar transação." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await pool.execute(
      "DELETE FROM transacoes WHERE id = ? AND usuario_id = ?",
      [req.params.id, req.usuario.id]
    );
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Transação não encontrada." });
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir transação." });
  }
});

module.exports = router;
