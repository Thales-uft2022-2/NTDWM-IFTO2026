import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

export async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, perfil, criado_em FROM usuarios ORDER BY nome'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
}

export async function criar(req, res) {
  try {
    const { nome, email, senha, confirmarSenha, perfil = 'ALUNO' } = req.body;

    if (!nome || !email || !senha || !confirmarSenha) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail, senha e confirmação.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({ erro: 'As senhas não conferem.' });
    }

    const [existente] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );

    if (existente.length) {
      return res.status(409).json({ erro: 'Já existe um usuário com este e-mail.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const perfilSeguro = perfil === 'ADMIN' ? 'ADMIN' : 'ALUNO';

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hash, perfilSeguro]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      email,
      perfil: perfilSeguro,
      mensagem: 'Usuário criado com sucesso.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
}

export async function alterarSenha(req, res) {
  try {
    const { senha, confirmarSenha } = req.body;

    if (!senha || !confirmarSenha) {
      return res.status(400).json({ erro: 'Informe a nova senha e a confirmação.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({ erro: 'As senhas não conferem.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [hash, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json({ mensagem: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao alterar senha.' });
  }
}

export async function remover(req, res) {
  try {
    if (Number(req.params.id) === Number(req.usuario.id)) {
      return res.status(400).json({ erro: 'Você não pode excluir o próprio usuário logado.' });
    }

    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json({ mensagem: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir usuário.' });
  }
}
