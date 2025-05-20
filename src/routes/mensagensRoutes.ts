import { Router } from 'express';
import { getMensagens, atualizarMensagem } from '../controllers/mensagensController';

const router = Router();

router.get('/', getMensagens);
router.put('/:chave', atualizarMensagem);

export default router;
