import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import { emitVehicleUpdate } from '../socket';

export const getVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await Vehicle.find().populate('transporterId').populate('clientId');
        res.status(200).json({ success: true, vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching vehicles' });
    }
};

export const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ success: true, vehicle });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid vehicle data or plate number already exists' });
    }
};

export const getVehicleStats = async (req: Request, res: Response) => {
    try {
        const totalVehicles = await Vehicle.countDocuments();
        const activeVehicles = await Vehicle.countDocuments({ status: 'Moving' });
        const stoppedVehicles = await Vehicle.countDocuments({ status: 'Stopped' });
        const maintenanceVehicles = await Vehicle.countDocuments({ status: 'Maintenance' });

        res.status(200).json({
            success: true,
            stats: {
                total: totalVehicles,
                active: activeVehicles,
                stopped: stoppedVehicles,
                maintenance: maintenanceVehicles
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching stats' });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.status(200).json({ success: true, vehicle });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data' });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.status(200).json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const toggleImmobilizer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'ON', 'OFF', or 'BLOCKED'

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

        vehicle.engineStatus = status;
        if (status === 'BLOCKED') {
            vehicle.currentSpeed = 0;
            vehicle.status = 'Stopped';
        }

        await vehicle.save();

        // Notify frontend immediately
        emitVehicleUpdate(vehicle);

        res.status(200).json({ success: true, vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send command' });
    }
};
