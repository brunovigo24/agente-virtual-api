import { authRoutes } from './routes/authRoutes';
import fluxoRoutes from './routes/fluxoRoutes';
import { autenticarJWT } from './middlewares/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();
import './config/inatividadeJob';
import express from 'express';
import webhookRoutes from './routes/webhookRoutes';
import statusRoutes from './routes/statusRoutes';
import mensagensRoutes from './routes/mensagensRoutes';
import destinosRoutes from './routes/destinosRoutes';
import menusRoutes from './routes/menusRoutes';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/fluxo', autenticarJWT, fluxoRoutes); 
app.use('/webhook', webhookRoutes);
app.use('/api/mensagens', autenticarJWT, mensagensRoutes);
app.use('/api/destinos', autenticarJWT, destinosRoutes);
app.use('/api/menus', autenticarJWT, menusRoutes);

app.use('/', statusRoutes);

export default app;
