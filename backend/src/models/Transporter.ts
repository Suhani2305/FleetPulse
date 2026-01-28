import mongoose from 'mongoose';

const transporterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    baseHub: { type: String, default: 'National' },
    fleetSize: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    reliability: { type: String, default: '100%' },
    amountPayable: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Suspended', 'Pending'], default: 'Active' },
}, { timestamps: true });

export default mongoose.model('Transporter', transporterSchema);
