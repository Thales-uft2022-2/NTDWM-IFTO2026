import {Navigate,Outlet} from 'react-router-dom'; import {useAuth} from '../context/AuthContext.jsx';
export default function AdminRoute(){const {usuario}=useAuth();return usuario?.perfil==='ADMIN'?<Outlet/>:<Navigate to="/dashboard" replace/>}
