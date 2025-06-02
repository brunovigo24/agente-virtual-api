import { Router } from 'express';
import { getFluxo, atualizarEtapa } from '../controllers/fluxoController';

const router = Router();

router.get('/', getFluxo);
router.patch('/:etapa', atualizarEtapa);

export default router;
