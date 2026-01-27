import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import gpsRoutes from './routes/gpsRoutes';
import connectDB from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

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

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'FleetPulse API is running' });
});

app.listen(PORT, () => {
    console.log(`📡 Backend Server running on port ${PORT}`);
});
