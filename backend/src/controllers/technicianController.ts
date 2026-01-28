import { Request, Response } from 'express';
import Technician from '../models/Technician';
import { getIO } from '../socket';

export const getTechnicians = async (req: Request, res: Response) => {
    try {
        const technicians = await Technician.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, technicians });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createTechnician = async (req: Request, res: Response) => {
    try {
        const technician = await Technician.create(req.body);
        const io = getIO();
        io.emit('technician-update', technician);
        res.status(201).json({ success: true, technician });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateTechnician = async (req: Request, res: Response) => {
    try {
        const technician = await Technician.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!technician) return res.status(404).json({ success: false, message: 'Technician not found' });

        const io = getIO();
        io.emit('technician-update', technician);
        res.status(200).json({ success: true, technician });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteTechnician = async (req: Request, res: Response) => {
    try {
        const technician = await Technician.findByIdAndDelete(req.params.id);
        if (!technician) return res.status(404).json({ success: false, message: 'Technician not found' });

        const io = getIO();
        io.emit('technician-delete', req.params.id);
        res.status(200).json({ success: true, message: 'Technician deleted' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateSalaryRecord = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { month, year, amount, status, paymentMethod, paymentDate } = req.body;

        const technician = await Technician.findById(id);
        if (!technician) return res.status(404).json({ success: false, message: 'Technician not found' });

        // Check if record for this month/year exists
        const recordIndex = (technician as any).salaryHistory.findIndex(
            (r: any) => r.month === month && r.year === year
        );

        const record = { month, year, amount, status, paymentMethod, paymentDate };

        if (recordIndex > -1) {
            (technician as any).salaryHistory[recordIndex] = record;
        } else {
            (technician as any).salaryHistory.push(record);
        }

        await technician.save();

        const io = getIO();
        io.emit('technician-update', technician);
        res.status(200).json({ success: true, technician });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};
