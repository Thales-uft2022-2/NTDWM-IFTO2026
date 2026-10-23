import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'academico',
  password: process.env.DB_PASSWORD || 'academico123',
  database: process.env.DB_NAME || 'usuarios_db',
  waitForConnections: true,
  connectionLimit: 10
});

export async function testarConexao() {
  const conn = await pool.getConnection();
  conn.release();
}
