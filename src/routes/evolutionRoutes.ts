import { Router } from 'express';
import { criarInstancia, gerarQR, gerarPairing, statusInstancia, listarInstancias, deletarInstancia } from '../controllers/evolutionController';


const router = Router();

router.post('/instancia', criarInstancia);
router.get('/qr/:nome', gerarQR);
//router.get('/pairing/:nome', gerarPairing); //Evolution API está retornando 200 OK mas com body null, aguardar correção do problema
//router.get('/status/:nome', statusInstancia); // Não está retornando o status correto, aguardar correção do problema
router.get('/listarInstancias', listarInstancias);  // Nova rota para listar instâncias, pode verificar status por aqui
router.delete('/instancia/delete/:instance', deletarInstancia); 

export default router;
