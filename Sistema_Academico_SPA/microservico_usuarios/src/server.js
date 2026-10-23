import 'dotenv/config';
import bcrypt from 'bcryptjs';
import app from './app.js';
import { pool, testarConexao } from './config/db.js';

const PORT = Number(process.env.PORT || 3001);

async function criarAdminPadrao() {
  const nome = process.env.ADMIN_NAME || 'Administrador IFTO';
  const email = process.env.ADMIN_EMAIL || 'admin@ifto.edu.br';
  const senha = process.env.ADMIN_PASSWORD || '123456';

  const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
  if (!rows.length) {
    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hash, 'ADMIN']
    );
    console.log(`Administrador inicial criado: ${email}`);
  }
}

async function iniciar() {
  try {
    await testarConexao();
    await criarAdminPadrao();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Microserviço de usuários rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar microserviço de usuários:', error);
    process.exit(1);
  }
}

iniciar();
