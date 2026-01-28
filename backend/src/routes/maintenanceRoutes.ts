import express from 'express';
import { getMaintenanceSchedule, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask } from '../controllers/maintenanceController';

const router = express.Router();

router.get('/', getMaintenanceSchedule);
router.post('/', createMaintenanceTask);
router.put('/:id', updateMaintenanceTask);
router.delete('/:id', deleteMaintenanceTask);

export default router;
