import { Router } from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = Router();

// Wrap async handler to properly handle promises
router.post('/whatsapp', (req, res, next) => {
  Promise.resolve(handleWebhook(req, res)).catch(next);
});

export default router;
