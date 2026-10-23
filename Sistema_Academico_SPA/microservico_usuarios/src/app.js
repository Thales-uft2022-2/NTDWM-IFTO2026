import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ servico: 'usuarios', status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
export default app;
