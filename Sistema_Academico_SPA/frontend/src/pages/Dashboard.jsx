import {useEffect,useState} from 'react'; import {academicoApi} from '../services/api.js';
export default function Dashboard(){const [r,setR]=useState({alunos:0,disciplinas:0,matriculas:0});const [erro,setErro]=useState('');
useEffect(()=>{academicoApi.get('/dashboard/resumo').then(({data})=>setR(data)).catch(e=>setErro(e.response?.data?.erro||'Erro ao carregar dashboard.'))},[]);
return <><h1>Dashboard</h1><p className="muted">Dados integrados do microserviço acadêmico.</p>{erro&&<div className="alert error">{erro}</div>}<div className="grid cards"><div className="card"><h3>Alunos</h3><strong>{r.alunos}</strong></div><div className="card"><h3>Disciplinas</h3><strong>{r.disciplinas}</strong></div><div className="card"><h3>Matrículas</h3><strong>{r.matriculas}</strong></div></div></>}
