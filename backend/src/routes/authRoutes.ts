import { Router } from 'express';
import { login, register, getUsers, updateUser, deleteUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', protect, register);
router.get('/users', protect, getUsers);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteUser);

export default router;
