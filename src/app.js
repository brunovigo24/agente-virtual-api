require('dotenv').config();
require('./config/inatividadeJob')(); 
const express = require('express');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
app.use(express.json()); // Middleware para analisar o corpo da requisição como JSON

app.use('/webhook', webhookRoutes);

app.get('/status', (req, res) => {
  res.json({ status: 'ok', message: 'API atendente-virtual-ccim está online' });
});

module.exports = app;
