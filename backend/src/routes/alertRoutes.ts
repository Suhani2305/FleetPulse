import express from 'express';
import { getAlerts, createAlert, resolveAlert, clearAllAlerts } from '../controllers/alertController';

const router = express.Router();

router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id/resolve', resolveAlert);
router.delete('/clear', clearAllAlerts);

export default router;
