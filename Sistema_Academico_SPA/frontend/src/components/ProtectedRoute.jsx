import {Navigate,Outlet} from 'react-router-dom'; import {useAuth} from '../context/AuthContext.jsx';
export default function ProtectedRoute(){const {autenticado}=useAuth();return autenticado?<Outlet/>:<Navigate to="/login" replace/>}
