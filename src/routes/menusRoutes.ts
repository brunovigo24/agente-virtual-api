import { Router } from 'express';
import { getMenus, atualizarMenu } from '../controllers/menusController';

const router = Router();

router.get('/', getMenus);
router.put('/:chave', atualizarMenu); // ex: /api/menus/menu_principal

export default router;
