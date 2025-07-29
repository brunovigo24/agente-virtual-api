import { Router } from 'express';
import * as acoesController from '../controllers/acoesController';
import multer from 'multer';

const router = Router();
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por arquivo
    files: 5 // Máximo 5 arquivos
  }
});

router.post('/', upload.array('arquivos', 5), acoesController.criar); 
router.get('/', acoesController.listar); 
router.put('/:id', upload.array('arquivos', 5), acoesController.atualizar); 
router.delete('/:id', acoesController.deletar);

export default router;
