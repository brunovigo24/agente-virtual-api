const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Status da API</title></head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>✅ API do Atendente Virtual está funcionando!</h1>
        <p>Versão 1.0 - ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

module.exports = router;
