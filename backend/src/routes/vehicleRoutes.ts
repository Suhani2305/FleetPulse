import express from 'express';
import { getVehicles, createVehicle, getVehicleStats, updateVehicle, deleteVehicle } from '../controllers/vehicleController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', protect, getVehicleStats);
router.get('/', protect, getVehicles);
router.post('/', protect, createVehicle);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, deleteVehicle);

export default router;
