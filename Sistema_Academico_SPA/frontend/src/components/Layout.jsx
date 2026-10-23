import {NavLink,Outlet} from 'react-router-dom'; import {useAuth} from '../context/AuthContext.jsx';
export default function Layout(){
 const {usuario,logout}=useAuth();
 return <div className="app-shell"><aside className="sidebar">
   <div><h2>IFTO Acadêmico</h2><p className="muted">{usuario?.nome}</p><span className="badge">{usuario?.perfil}</span></div>
   <nav>
    <NavLink to="/dashboard">Dashboard</NavLink>
    <NavLink to="/alunos">Alunos</NavLink>
    <NavLink to="/disciplinas">Disciplinas</NavLink>
    <NavLink to="/matriculas">Matrículas</NavLink>
    {usuario?.perfil==='ADMIN' && <NavLink to="/usuarios">Usuários</NavLink>}
    <NavLink to="/perfil">Perfil</NavLink>
   </nav>
   <button className="danger" onClick={logout}>Sair</button>
 </aside><main className="content"><Outlet/></main></div>
}
