import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';

// This controller simulates a GPS Listener. 
// REAL GPS Trackers send data via TCP/UDP usually, but for this web app, 
// we will provide an HTTP endpoint that trackers (or a gateway) can ping.

export const processGpsPing = async (req: Request, res: Response) => {
    try {
        const { deviceId, lat, lng, speed, fuel } = req.body;

        if (!deviceId) {
            return res.status(400).json({ success: false, message: 'DeviceId is required' });
        }

        // Find vehicle by its unique deviceId
        const vehicle = await Vehicle.findOne({ deviceId });

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found with this GPS ID' });
        }

        // Update real-time stats
        vehicle.latitude = lat || vehicle.latitude;
        vehicle.longitude = lng || vehicle.longitude;
        vehicle.currentSpeed = speed !== undefined ? speed : vehicle.currentSpeed;
        vehicle.fuelLevel = fuel !== undefined ? fuel : vehicle.fuelLevel;
        vehicle.status = (speed > 0) ? 'Moving' : 'Stopped';
        vehicle.lastUpdated = new Date();

        await vehicle.save();

        res.status(200).json({
            success: true,
            message: `Updated ${vehicle.plateNumber}`,
            location: { lat: vehicle.latitude, lng: vehicle.longitude }
        });

    } catch (error) {
        console.error('GPS Processing Error:', error);
        res.status(500).json({ success: false, message: 'Server error processing GPS ping' });
    }
};
