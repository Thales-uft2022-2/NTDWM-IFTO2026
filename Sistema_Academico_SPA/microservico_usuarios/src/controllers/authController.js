import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const [rows] = await pool.query(
      'SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const usuario = rows[0];
    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });

    const token = gerarToken(usuario);
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno ao realizar login.' });
  }
}

export async function me(req, res) {
  res.json({ usuario: req.usuario });
}
