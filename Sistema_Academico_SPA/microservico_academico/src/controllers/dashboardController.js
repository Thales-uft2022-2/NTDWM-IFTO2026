import { pool } from '../config/db.js';
export async function resumo(req,res){
 try{
  const [[a]]=await pool.query('SELECT COUNT(*) total FROM alunos');
  const [[d]]=await pool.query('SELECT COUNT(*) total FROM disciplinas');
  const [[m]]=await pool.query('SELECT COUNT(*) total FROM matriculas');
  res.json({alunos:a.total,disciplinas:d.total,matriculas:m.total});
 }catch(e){console.error(e);res.status(500).json({erro:'Erro ao carregar resumo.'});}
}
