import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    plateNumber: { type: String, required: true, unique: true },
    deviceId: { type: String, unique: true, sparse: true }, // Unique GPS Hardware ID
    model: { type: String, required: true },
    type: { type: String, enum: ['Truck', 'Van', 'Car', 'Bike'], default: 'Truck' },
    status: { type: String, enum: ['Moving', 'Stopped', 'Idle', 'Maintenance'], default: 'Stopped' },
    fuelLevel: { type: Number, default: 100 },
    currentSpeed: { type: Number, default: 0 },
    latitude: { type: Number, default: 28.6139 }, // New: Delhi default
    longitude: { type: Number, default: 77.2090 }, // New: Delhi default
    lastUpdated: { type: Date, default: Date.now },
    assignedRoute: { type: String },
    driverName: { type: String }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
