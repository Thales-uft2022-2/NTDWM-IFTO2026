import {Navigate,Route,Routes} from 'react-router-dom';
import Login from './pages/Login.jsx'; import Dashboard from './pages/Dashboard.jsx'; import Alunos from './pages/Alunos.jsx'; import Disciplinas from './pages/Disciplinas.jsx'; import Matriculas from './pages/Matriculas.jsx'; import Usuarios from './pages/Usuarios.jsx'; import Perfil from './pages/Perfil.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; import AdminRoute from './components/AdminRoute.jsx'; import Layout from './components/Layout.jsx'; import {useAuth} from './context/AuthContext.jsx';
export default function App(){
 const {autenticado}=useAuth();
 return <Routes>
  <Route path="/login" element={autenticado?<Navigate to="/dashboard" replace/>:<Login/>}/>
  <Route element={<ProtectedRoute/>}><Route element={<Layout/>}>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/alunos" element={<Alunos/>}/>
    <Route path="/disciplinas" element={<Disciplinas/>}/>
    <Route path="/matriculas" element={<Matriculas/>}/>
    <Route path="/perfil" element={<Perfil/>}/>
    <Route element={<AdminRoute/>}><Route path="/usuarios" element={<Usuarios/>}/></Route>
  </Route></Route>
  <Route path="*" element={<Navigate to={autenticado?'/dashboard':'/login'} replace/>}/>
 </Routes>
}
