import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    email: { type: String, unique: true },
    specialty: { type: String, enum: ['GPS Installation', 'Recharge', 'Hardware Repair', 'IoT Diagnostics'], default: 'GPS Installation' },
    status: { type: String, enum: ['Available', 'On Site', 'On Break', 'Inactive'], default: 'Available' },
    baseCity: { type: String, default: 'Delhi' },
    monthlySalary: { type: Number, default: 0 },
    lastSalaryDate: { type: Date },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    photoUrl: { type: String },
    aadharNumber: { type: String },
    residentialAddress: { type: String },
    emergencyContact: { type: String },
    dateOfJoining: { type: Date, default: Date.now },
    jobsCompleted: { type: Number, default: 0 },
    salaryHistory: [{
        month: { type: String, required: true }, // e.g., "January"
        year: { type: Number, required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
        paymentDate: { type: Date },
        paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Bank'], default: 'UPI' }
    }]
}, { timestamps: true });

export default mongoose.model('Technician', technicianSchema);
