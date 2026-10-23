import express from 'express'; import cors from 'cors';
import alunoRoutes from './routes/alunoRoutes.js'; import disciplinaRoutes from './routes/disciplinaRoutes.js'; import matriculaRoutes from './routes/matriculaRoutes.js';
import {autenticar} from './middlewares/auth.js'; import {resumo} from './controllers/dashboardController.js';
const app=express(); app.use(cors()); app.use(express.json());
app.get('/health',(req,res)=>res.json({servico:'academico',status:'ok'}));
app.get('/dashboard/resumo',autenticar,resumo);
app.use('/alunos',alunoRoutes); app.use('/disciplinas',disciplinaRoutes); app.use('/matriculas',matriculaRoutes);
app.use((req,res)=>res.status(404).json({erro:'Rota não encontrada.'})); export default app;
