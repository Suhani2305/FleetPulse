import express from 'express';
import { processGpsPing } from '../controllers/gpsController';

const router = express.Router();

// Public endpoint for GPS trackers to ping
// In a real pro environment, you'd use a secret key or fixed IP whitelist
router.post('/ping', processGpsPing);

export default router;
