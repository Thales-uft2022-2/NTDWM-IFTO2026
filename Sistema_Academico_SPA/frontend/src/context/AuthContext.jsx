import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {authApi,configurarToken} from '../services/api.js';
const C=createContext(null); const KEY='sistema_academico_auth';
export function AuthProvider({children}){
 const [sessao,setSessao]=useState(()=>{try{const s=localStorage.getItem(KEY);return s?JSON.parse(s):null}catch{return null}});
 useEffect(()=>{configurarToken(sessao?.token); if(sessao)localStorage.setItem(KEY,JSON.stringify(sessao)); else localStorage.removeItem(KEY)},[sessao]);
 async function login(email,senha){const {data}=await authApi.post('/auth/login',{email,senha});setSessao(data);return data}
 function logout(){setSessao(null)}
 const value=useMemo(()=>({token:sessao?.token||null,usuario:sessao?.usuario||null,autenticado:Boolean(sessao?.token),login,logout}),[sessao]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);
