import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  // Usa Intl.DateTimeFormat para garantir o timezone de Brasília
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const dataHora = formatter.format(now).replace(',', '');

  res.send(`
    <html>
      <head><title>Status da API</title></head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>✅ API do Atendente Virtual está funcionando!</h1>
        <p>Versão 2.0.3 - ${dataHora} (Horário de Brasília)</p>
      </body>
    </html>
  `);
});

export default router;
