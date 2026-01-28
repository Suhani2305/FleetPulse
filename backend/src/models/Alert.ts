import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    type: string;
    vehicle: string;
    location: string;
    severity: 'Critical' | 'Warning' | 'Info';
    detail: string;
    status: 'Unresolved' | 'Resolved';
    timestamp: Date;
}

const AlertSchema: Schema = new Schema({
    type: { type: String, required: true },
    vehicle: { type: String, required: true }, // License Plate or Vehicle ID
    location: { type: String, required: true },
    severity: { type: String, enum: ['Critical', 'Warning', 'Info'], default: 'Info' },
    detail: { type: String, required: true },
    status: { type: String, enum: ['Unresolved', 'Resolved'], default: 'Unresolved' },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAlert>('Alert', AlertSchema);
