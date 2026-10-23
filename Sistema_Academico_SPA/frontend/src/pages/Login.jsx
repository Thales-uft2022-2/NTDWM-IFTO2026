import {useState} from 'react'; import {useAuth} from '../context/AuthContext.jsx';
export default function Login(){
 const {login}=useAuth(); const [email,setEmail]=useState('admin@ifto.edu.br'); const [senha,setSenha]=useState('123456'); const [erro,setErro]=useState(''); const [carregando,setCarregando]=useState(false);
 async function entrar(e){e.preventDefault();setErro('');setCarregando(true);try{await login(email,senha)}catch(err){setErro(err.response?.data?.erro||'Não foi possível conectar à API.')}finally{setCarregando(false)}}
 return <div className="login-page"><form className="card login-card" onSubmit={entrar}><h1>Sistema Acadêmico</h1><p className="muted">SPA + Microserviços + JWT</p>{erro&&<div className="alert error">{erro}</div>}
 <label>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
 <label>Senha</label><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} required/>
 <button disabled={carregando}>{carregando?'Entrando...':'Entrar'}</button></form></div>
}
