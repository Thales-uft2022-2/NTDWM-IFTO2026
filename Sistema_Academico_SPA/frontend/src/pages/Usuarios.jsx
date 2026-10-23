import {useEffect,useState} from 'react'; import {authApi} from '../services/api.js'; import Feedback from '../components/Feedback.jsx'; import {useAuth} from '../context/AuthContext.jsx';
const inicial={nome:'',email:'',senha:'',confirmarSenha:'',perfil:'ALUNO'};
export default function Usuarios(){
 const {usuario:logado}=useAuth(); const [usuarios,setUsuarios]=useState([]); const [form,setForm]=useState(inicial); const [erro,setErro]=useState(''); const [sucesso,setSucesso]=useState(''); const [novaSenha,setNovaSenha]=useState({});
 async function carregar(){try{const {data}=await authApi.get('/usuarios');setUsuarios(data)}catch(e){setErro(e.response?.data?.erro||'Erro ao carregar usuários.')}}
 useEffect(()=>{carregar()},[]);
 async function criar(e){e.preventDefault();setErro('');setSucesso('');try{await authApi.post('/usuarios',form);setForm(inicial);setSucesso('Usuário criado com sucesso.');carregar()}catch(e){setErro(e.response?.data?.erro||'Erro ao criar usuário.')}}
 async function trocarSenha(id){const senha=novaSenha[id]||''; if(senha.length<6){setErro('A nova senha deve ter pelo menos 6 caracteres.');return} try{await authApi.put(`/usuarios/${id}/senha`,{senha,confirmarSenha:senha});setSucesso('Senha alterada.');setErro('');setNovaSenha({...novaSenha,[id]:''})}catch(e){setErro(e.response?.data?.erro||'Erro ao alterar senha.')}}
 async function excluir(id){if(!confirm('Excluir este usuário?'))return;try{await authApi.delete(`/usuarios/${id}`);carregar()}catch(e){setErro(e.response?.data?.erro||'Erro ao excluir usuário.')}}
 return <><h1>Usuários</h1><p className="muted">Crie contas de acesso para alunos e administradores.</p><Feedback erro={erro} sucesso={sucesso}/>
 <form className="card user-form" onSubmit={criar}>
  <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} required/>
  <input type="email" placeholder="E-mail" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
  <input type="password" placeholder="Senha" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})} required/>
  <input type="password" placeholder="Confirmar senha" value={form.confirmarSenha} onChange={e=>setForm({...form,confirmarSenha:e.target.value})} required/>
  <select value={form.perfil} onChange={e=>setForm({...form,perfil:e.target.value})}><option value="ALUNO">ALUNO</option><option value="ADMIN">ADMIN</option></select>
  <button>Criar usuário</button>
 </form>
 <div className="card table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Nova senha</th><th>Ações</th></tr></thead><tbody>{usuarios.map(u=><tr key={u.id}><td>{u.nome}</td><td>{u.email}</td><td><span className="badge">{u.perfil}</span></td><td><input className="small-input" type="password" placeholder="Nova senha" value={novaSenha[u.id]||''} onChange={e=>setNovaSenha({...novaSenha,[u.id]:e.target.value})}/></td><td className="actions"><button className="small" onClick={()=>trocarSenha(u.id)}>Alterar senha</button>{u.id!==logado?.id&&<button className="danger small" onClick={()=>excluir(u.id)}>Excluir</button>}</td></tr>)}</tbody></table></div>
 </>}
