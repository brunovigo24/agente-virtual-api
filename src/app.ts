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
import evolutionRoutes from './routes/evolutionRoutes';
import acoesRoutes from './routes/acoesRoutes';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/fluxo', autenticarJWT, fluxoRoutes); 
app.use('/webhook', webhookRoutes);
app.use('/api/mensagens', autenticarJWT, mensagensRoutes);
app.use('/api/destinos', autenticarJWT, destinosRoutes);
app.use('/api/menus', autenticarJWT, menusRoutes);
app.use('/api/evolution', autenticarJWT, evolutionRoutes);
app.use('/api/acoes', autenticarJWT, acoesRoutes);
app.use('/', statusRoutes);

export default app;
