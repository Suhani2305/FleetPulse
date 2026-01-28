import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import { emitVehicleUpdate } from '../socket';

// This controller simulates a GPS Listener. 
// REAL GPS Trackers send data via TCP/UDP usually, but for this web app, 
// we will provide an HTTP endpoint that trackers (or a gateway) can ping.

export const processGpsPing = async (req: Request, res: Response) => {
    try {
        const { deviceId, lat, lng, speed, fuel, satellites, gsmSignal, internalBattery, engineStatus } = req.body;

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
        vehicle.currentSpeed = vehicle.engineStatus === 'BLOCKED' ? 0 : (speed !== undefined ? speed : vehicle.currentSpeed);
        vehicle.fuelLevel = fuel !== undefined ? fuel : vehicle.fuelLevel;
        vehicle.satellites = satellites !== undefined ? satellites : vehicle.satellites;
        vehicle.gsmSignal = gsmSignal !== undefined ? gsmSignal : vehicle.gsmSignal;
        vehicle.internalBattery = internalBattery !== undefined ? internalBattery : vehicle.internalBattery;

        // Only update if not explicitly blocked
        if (vehicle.engineStatus !== 'BLOCKED') {
            vehicle.engineStatus = engineStatus || vehicle.engineStatus;
            vehicle.status = (vehicle.currentSpeed > 0) ? 'Moving' : 'Stopped';
        } else {
            vehicle.status = 'Stopped';
        }

        vehicle.lastUpdated = new Date();

        await vehicle.save();

        // Emit to real-time clients
        emitVehicleUpdate(vehicle);

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
