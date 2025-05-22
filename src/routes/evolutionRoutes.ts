// src/routes/evolutionRoutes.ts
import { Router } from 'express';
import { criarInstancia, gerarQR } from '../controllers/evolutionController';


const router = Router();

router.post('/instancia', criarInstancia);
router.get('/qr/:nome', gerarQR);
// router.get('/pairing/:nome', gerarPairing);
// router.get('/status/:nome', statusInstancia);

export default router;
