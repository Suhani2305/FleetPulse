import { Request, Response } from 'express';
import Alert from '../models/Alert';
import { getIO } from '../socket';

export const getAlerts = async (req: Request, res: Response) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50);
        res.status(200).json({ success: true, alerts });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createAlert = async (req: Request, res: Response) => {
    try {
        const alert = new Alert(req.body);
        await alert.save();

        const io = getIO();
        io.emit('new-alert', alert);

        res.status(201).json({ success: true, alert });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const resolveAlert = async (req: Request, res: Response) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
        if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });

        const io = getIO();
        io.emit('alert-resolved', alert);

        res.status(200).json({ success: true, alert });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const clearAllAlerts = async (req: Request, res: Response) => {
    try {
        await Alert.deleteMany({ status: 'Resolved' });
        res.status(200).json({ success: true, message: 'Resolved alerts cleared' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
