// DEMO: API pública real para executar imediatamente.
// Para integrar o Capítulo 1, troque BASE_URL e ajuste o caminho em usersService.js.
// Emulador Android: um backend no computador geralmente é acessado por http://10.0.2.2:PORTA.
// Celular físico: use o IP local do computador na mesma rede Wi-Fi.
// Não use localhost do celular para apontar para o computador.
export const BASE_URL = 'https://jsonplaceholder.typicode.com';
export const USERS_ENDPOINT = `${BASE_URL}/users`;
export const REQUEST_TIMEOUT_MS = 12000;
