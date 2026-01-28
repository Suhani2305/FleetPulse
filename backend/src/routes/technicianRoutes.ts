import { Router } from 'express';
import { getTechnicians, createTechnician, updateTechnician, deleteTechnician, updateSalaryRecord } from '../controllers/technicianController';

const router = Router();

router.get('/', getTechnicians);
router.post('/', createTechnician);
router.put('/:id', updateTechnician);
router.delete('/:id', deleteTechnician);
router.patch('/:id/salary', updateSalaryRecord);

export default router;
