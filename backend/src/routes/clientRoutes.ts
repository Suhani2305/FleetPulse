import express from 'express';
import { getClients, createClient, updateClient, getBillingStats, updateClientBilling, getClientVehicles } from '../controllers/clientController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getClients);
router.post('/', protect, createClient);
router.put('/:id', protect, updateClient);
router.get('/billing/overview', protect, getBillingStats);
router.patch('/:id/billing', protect, updateClientBilling);
router.get('/:id/vehicles', protect, getClientVehicles);

export default router;
