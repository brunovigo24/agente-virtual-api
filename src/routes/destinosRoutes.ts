import { Router } from 'express';
import { getDestinos, atualizarDestino } from '../controllers/destinosController';

const router = Router();

router.get('/', getDestinos);
router.put('/:chave', atualizarDestino);

export default router;
