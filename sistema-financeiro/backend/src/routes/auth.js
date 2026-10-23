const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha || senha.length < 6) {
      return res.status(400).json({ erro: "Informe nome, e-mail e senha com pelo menos 6 caracteres." });
    }

    const [existentes] = await pool.execute("SELECT id FROM usuarios WHERE email = ?", [email.trim().toLowerCase()]);
    if (existentes.length) return res.status(409).json({ erro: "Este e-mail já está cadastrado." });

    const hash = await bcrypt.hash(senha, 10);
    const [resultado] = await pool.execute(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome.trim(), email.trim().toLowerCase(), hash]
    );

    return res.status(201).json({ mensagem: "Cadastro realizado com sucesso.", usuario: { id: resultado.insertId, nome: nome.trim(), email: email.trim().toLowerCase() } });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Não foi possível realizar o cadastro." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: "Informe e-mail e senha." });

    const [usuarios] = await pool.execute(
      "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?",
      [email.trim().toLowerCase()]
    );
    if (!usuarios.length || !(await bcrypt.compare(senha, usuarios[0].senha_hash))) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const usuario = usuarios[0];
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET || "troque_este_segredo",
      { expiresIn: "8h" }
    );
    return res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Não foi possível realizar o login." });
  }
});

module.exports = router;
