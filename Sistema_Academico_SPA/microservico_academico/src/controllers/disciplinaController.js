import { pool } from '../config/db.js';
export async function listar(req,res){ try{ const [r]=await pool.query('SELECT * FROM disciplinas ORDER BY nome'); res.json(r);}catch(e){console.error(e);res.status(500).json({erro:'Erro ao listar disciplinas.'});}}
export async function criar(req,res){ try{
 const {nome,codigo,carga_horaria,professor}=req.body;
 if(!nome||!codigo||!carga_horaria)return res.status(400).json({erro:'Nome, código e carga horária são obrigatórios.'});
 const [r]=await pool.query('INSERT INTO disciplinas (nome,codigo,carga_horaria,professor) VALUES (?,?,?,?)',[nome,codigo,carga_horaria,professor||null]);
 res.status(201).json({id:r.insertId,nome,codigo,carga_horaria,professor});
}catch(e){console.error(e); if(e.code==='ER_DUP_ENTRY')return res.status(409).json({erro:'Código já cadastrado.'});res.status(500).json({erro:'Erro ao cadastrar disciplina.'});}}
export async function remover(req,res){ try{ const [r]=await pool.query('DELETE FROM disciplinas WHERE id=?',[req.params.id]); if(!r.affectedRows)return res.status(404).json({erro:'Disciplina não encontrada.'}); res.json({mensagem:'Disciplina removida.'});}catch(e){console.error(e);res.status(500).json({erro:'Erro ao remover disciplina.'});}}
