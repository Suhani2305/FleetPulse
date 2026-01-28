import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import gpsRoutes from './routes/gpsRoutes';
import clientRoutes from './routes/clientRoutes';
import transporterRoutes from './routes/transporterRoutes';
import technicianRoutes from './routes/technicianRoutes';
import alertRoutes from './routes/alertRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import geofenceRoutes from './routes/geofenceRoutes';
import connectDB from './config/db';
import { initSocket } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/gps', gpsRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/transporters', transporterRoutes);
app.use('/api/v1/technicians', technicianRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/geofences', geofenceRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'FleetPulse API is running' });
});

httpServer.listen(PORT, () => {
    console.log(`📡 Backend Server running on port ${PORT}`);
});
