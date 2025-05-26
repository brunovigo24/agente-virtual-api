import { Router } from 'express';
import * as acoesController from '../controllers/acoesController';

const router = Router();

router.post('/', acoesController.criar); 
router.get('/', acoesController.listar); 
router.get('/:etapa', acoesController.buscarPorEtapa); //Testado mas acredito que não vá utilizar
router.put('/:id', acoesController.atualizar); 
router.delete('/:id', acoesController.deletar);

export default router;
