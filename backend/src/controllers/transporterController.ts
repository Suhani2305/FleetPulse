import { Request, Response } from 'express';
import Transporter from '../models/Transporter';
import { getIO } from '../socket';

export const getTransporters = async (req: Request, res: Response) => {
    try {
        const transporters = await Transporter.find().sort({ createdAt: -1 });
        res.json({ success: true, transporters });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTransporter = async (req: Request, res: Response) => {
    try {
        const transporter = await Transporter.create(req.body);
        const io = getIO();
        io.emit('transporter-update', transporter);
        res.status(201).json({ success: true, transporter });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateTransporter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transporter = await Transporter.findByIdAndUpdate(id, req.body, { new: true });
        if (!transporter) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const io = getIO();
        io.emit('transporter-update', transporter);

        res.json({ success: true, transporter });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteTransporter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Transporter.findByIdAndDelete(id);
        res.json({ success: true, message: 'Vendor deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
