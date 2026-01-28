import { Router } from 'express';
import { getTransporters, createTransporter, updateTransporter, deleteTransporter } from '../controllers/transporterController';

const router = Router();

router.get('/', getTransporters);
router.post('/', createTransporter);
router.put('/:id', updateTransporter);
router.delete('/:id', deleteTransporter);

export default router;
