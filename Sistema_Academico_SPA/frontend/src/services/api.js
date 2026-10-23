import axios from 'axios';

const host = window.location.hostname || 'localhost';
const authBase = import.meta.env.VITE_AUTH_API_URL || `${window.location.protocol}//${host}:3001`;
const academicoBase = import.meta.env.VITE_ACADEMICO_API_URL || `${window.location.protocol}//${host}:3002`;

export const authApi = axios.create({ baseURL: authBase });
export const academicoApi = axios.create({ baseURL: academicoBase });

export function configurarToken(token){
  if(token){
    authApi.defaults.headers.common.Authorization=`Bearer ${token}`;
    academicoApi.defaults.headers.common.Authorization=`Bearer ${token}`;
  }else{
    delete authApi.defaults.headers.common.Authorization;
    delete academicoApi.defaults.headers.common.Authorization;
  }
}
