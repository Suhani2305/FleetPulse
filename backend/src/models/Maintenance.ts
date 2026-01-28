import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
    vehicle: string;
    service: string;
    dueDate: Date;
    mileage: string;
    status: 'Upcoming' | 'Overdue' | 'Scheduled' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
    technician?: string;
    notes?: string;
    cost?: number;
}

const MaintenanceSchema: Schema = new Schema({
    vehicle: { type: String, required: true },
    service: { type: String, required: true },
    dueDate: { type: Date, required: true },
    mileage: { type: String, required: true },
    status: { type: String, enum: ['Upcoming', 'Overdue', 'Scheduled', 'Completed'], default: 'Upcoming' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    technician: { type: String },
    notes: { type: String },
    cost: { type: Number },
}, { timestamps: true });

export default mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
