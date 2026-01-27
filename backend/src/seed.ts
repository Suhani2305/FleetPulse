// import connectDB from './config/db';
import User from './models/User';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ email: 'admin@fleetpulse.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const superAdmin = new User({
            name: 'Super Admin',
            email: 'admin@fleetpulse.com',
            passwordHash: 'admin123', // Will be hashed by pre-save hook
            role: 'SuperAdmin',
        });

        await superAdmin.save();
        console.log('✅ Super Admin created: admin@fleetpulse.com / admin123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

seedSuperAdmin();
