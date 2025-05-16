import dotenv from 'dotenv';
dotenv.config();
import './config/inatividadeJob';
import express from 'express';
import webhookRoutes from './routes/webhookRoutes';
import statusRoutes from './routes/statusRoutes';

const app = express();
app.use(express.json());

app.use('/webhook', webhookRoutes);
app.use('/', statusRoutes);

export default app;
