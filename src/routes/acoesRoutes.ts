import { Router } from 'express';
import * as acoesController from '../controllers/acoesController';
import multer from 'multer';

const router = Router();
const upload = multer();

router.post('/', upload.single('arquivo'), acoesController.criar); 
router.get('/', acoesController.listar); 
router.get('/:etapa', acoesController.buscarPorEtapa); //Testado mas acredito que não vá utilizar
router.put('/:id', upload.single('arquivo'), acoesController.atualizar); 
router.delete('/:id', acoesController.deletar);

export default router;
