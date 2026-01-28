import mongoose, { Schema, Document } from 'mongoose';

export interface IGeofence extends Document {
    name: string;
    description?: string;
    type: 'Circle' | 'Polygon';
    coordinates: any; // GeoJSON or custom points
    radius?: number;  // For Circle
    center?: {
        lat: number;
        lng: number;
    };
    color: string;
    createdBy: mongoose.Types.ObjectId;
    assignedVehicles: mongoose.Types.ObjectId[];
    alerts: string[]; // ['Enter', 'Exit']
    status: 'Active' | 'Inactive';
    createdAt: Date;
}

const GeofenceSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['Circle', 'Polygon'], default: 'Polygon' },
    coordinates: { type: Schema.Types.Mixed }, // Array of {lat, lng} for Polygon
    radius: { type: Number },
    center: {
        lat: { type: Number },
        lng: { type: Number }
    },
    color: { type: String, default: '#21a0b5' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedVehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
    alerts: { type: [String], default: ['Enter', 'Exit'] },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export default mongoose.model<IGeofence>('Geofence', GeofenceSchema);
