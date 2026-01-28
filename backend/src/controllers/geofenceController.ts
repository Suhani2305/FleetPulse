import { Request, Response } from 'express';
import Geofence from '../models/Geofence';
import { emitGeofenceUpdate } from '../socket';

export const getGeofences = async (req: Request, res: Response) => {
    try {
        const geofences = await Geofence.find().populate('createdBy', 'name');
        res.status(200).json({ success: true, geofences });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createGeofence = async (req: Request, res: Response) => {
    try {
        const { name, description, type, coordinates, radius, center, color, assignedVehicles, alerts } = req.body;
        const newGeofence = new Geofence({
            name,
            description,
            type,
            coordinates,
            radius,
            center,
            color,
            assignedVehicles,
            alerts,
            createdBy: (req as any).user?.id || null
        });
        await newGeofence.save();
        emitGeofenceUpdate({ type: 'CREATE', geofence: newGeofence });
        res.status(201).json({ success: true, geofence: newGeofence });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateGeofence = async (req: Request, res: Response) => {
    try {
        const updatedGeofence = await Geofence.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGeofence) return res.status(404).json({ success: false, message: 'Geofence not found' });
        emitGeofenceUpdate({ type: 'UPDATE', geofence: updatedGeofence });
        res.status(200).json({ success: true, geofence: updatedGeofence });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteGeofence = async (req: Request, res: Response) => {
    try {
        const geofence = await Geofence.findByIdAndDelete(req.params.id);
        if (!geofence) return res.status(404).json({ success: false, message: 'Geofence not found' });
        emitGeofenceUpdate({ type: 'DELETE', id: req.params.id });
        res.status(200).json({ success: true, message: 'Geofence deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
