import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    createdBy?: string;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SuperAdmin', 'Admin', 'Manager'], default: 'Admin' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    createdBy: { type: String, default: 'System' },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function () {
    const user = this as any;
    if (!user.isModified('passwordHash')) return;

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
