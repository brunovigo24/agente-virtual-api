import dotenv from 'dotenv';
dotenv.config();
import './config/inatividadeJob';
import express from 'express';
import webhookRoutes from './routes/webhookRoutes';
import statusRoutes from './routes/statusRoutes';
import mensagensRoutes from './routes/mensagensRoutes';
import destinosRoutes from './routes/destinosRoutes';import menusRoutes from './routes/menusRoutes';



const app = express();
app.use(express.json());

app.use('/webhook', webhookRoutes);
app.use('/api/mensagens', mensagensRoutes);
app.use('/api/destinos', destinosRoutes);
app.use('/api/menus', menusRoutes);

app.use('/', statusRoutes);

export default app;
