import { pool } from '../config/db.js';
export async function listar(req,res){ try{
 const [r]=await pool.query(`SELECT m.id,m.semestre,m.criado_em,a.id aluno_id,a.nome aluno_nome,a.matricula aluno_matricula,d.id disciplina_id,d.nome disciplina_nome,d.codigo disciplina_codigo FROM matriculas m JOIN alunos a ON a.id=m.aluno_id JOIN disciplinas d ON d.id=m.disciplina_id ORDER BY m.id DESC`);
 res.json(r);
}catch(e){console.error(e);res.status(500).json({erro:'Erro ao listar matrículas.'});}}
export async function criar(req,res){ try{
 const {aluno_id,disciplina_id,semestre}=req.body;
 if(!aluno_id||!disciplina_id||!semestre)return res.status(400).json({erro:'Aluno, disciplina e semestre são obrigatórios.'});
 const [r]=await pool.query('INSERT INTO matriculas (aluno_id,disciplina_id,semestre) VALUES (?,?,?)',[aluno_id,disciplina_id,semestre]);
 res.status(201).json({id:r.insertId,aluno_id,disciplina_id,semestre});
}catch(e){console.error(e); if(e.code==='ER_DUP_ENTRY')return res.status(409).json({erro:'Esta matrícula já existe.'});res.status(500).json({erro:'Erro ao realizar matrícula.'});}}
export async function remover(req,res){ try{ const [r]=await pool.query('DELETE FROM matriculas WHERE id=?',[req.params.id]); if(!r.affectedRows)return res.status(404).json({erro:'Matrícula não encontrada.'});res.json({mensagem:'Matrícula removida.'});}catch(e){console.error(e);res.status(500).json({erro:'Erro ao remover matrícula.'});}}
