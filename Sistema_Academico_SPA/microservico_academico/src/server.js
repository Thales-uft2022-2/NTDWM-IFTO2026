import 'dotenv/config'; import app from './app.js'; import {testarConexao} from './config/db.js';
const PORT=Number(process.env.PORT||3002);
async function iniciar(){ try{ await testarConexao(); app.listen(PORT,'0.0.0.0',()=>console.log(`Microserviço acadêmico rodando na porta ${PORT}`)); }catch(e){console.error('Falha ao iniciar microserviço acadêmico:',e);process.exit(1);} }
iniciar();
