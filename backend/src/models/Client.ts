import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    status: { type: String, enum: ['Premium', 'Enterprise', 'Growth', 'Standard'], default: 'Standard' },
    billingDue: { type: Number, default: 0 },
    billingPaid: { type: Number, default: 0 },
    monthlySubscriptionFee: { type: Number, default: 5000 },
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
