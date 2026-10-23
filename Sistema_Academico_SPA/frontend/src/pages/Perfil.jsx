import {useAuth} from '../context/AuthContext.jsx';
export default function Perfil(){const {usuario}=useAuth();return <><h1>Meu perfil</h1><div className="card"><p><strong>ID:</strong> {usuario?.id}</p><p><strong>Nome:</strong> {usuario?.nome}</p><p><strong>E-mail:</strong> {usuario?.email}</p><p><strong>Perfil:</strong> {usuario?.perfil}</p></div></>}
