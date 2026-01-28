import { Request, Response } from 'express';
import Maintenance from '../models/Maintenance';

export const getMaintenanceSchedule = async (req: Request, res: Response) => {
    try {
        const schedule = await Maintenance.find().sort({ dueDate: 1 });
        res.status(200).json({ success: true, schedule });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createMaintenanceTask = async (req: Request, res: Response) => {
    try {
        const task = new Maintenance(req.body);
        await task.save();
        res.status(201).json({ success: true, task });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateMaintenanceTask = async (req: Request, res: Response) => {
    try {
        const task = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.status(200).json({ success: true, task });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteMaintenanceTask = async (req: Request, res: Response) => {
    try {
        const task = await Maintenance.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};
