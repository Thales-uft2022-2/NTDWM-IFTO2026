import { pool } from '../config/db.js';
export async function listar(req,res){ try{ const [r]=await pool.query('SELECT * FROM alunos ORDER BY nome'); res.json(r);}catch(e){console.error(e);res.status(500).json({erro:'Erro ao listar alunos.'});}}
export async function criar(req,res){ try{
  const {nome,matricula,curso,email}=req.body;
  if(!nome||!matricula||!curso) return res.status(400).json({erro:'Nome, matrícula e curso são obrigatórios.'});
  const [r]=await pool.query('INSERT INTO alunos (nome,matricula,curso,email) VALUES (?,?,?,?)',[nome,matricula,curso,email||null]);
  res.status(201).json({id:r.insertId,nome,matricula,curso,email});
}catch(e){console.error(e); if(e.code==='ER_DUP_ENTRY') return res.status(409).json({erro:'Matrícula já cadastrada.'}); res.status(500).json({erro:'Erro ao cadastrar aluno.'});}}
export async function remover(req,res){ try{ const [r]=await pool.query('DELETE FROM alunos WHERE id=?',[req.params.id]); if(!r.affectedRows)return res.status(404).json({erro:'Aluno não encontrado.'}); res.json({mensagem:'Aluno removido.'});}catch(e){console.error(e);res.status(500).json({erro:'Erro ao remover aluno.'});}}
