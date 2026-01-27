import Vehicle from './models/Vehicle';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const vehicles = [
    {
        plateNumber: 'HR-26-CZ-9021',
        deviceId: 'GPS-9021',
        model: 'Tata Prima 4028.S',
        type: 'Truck',
        status: 'Moving',
        fuelLevel: 82,
        currentSpeed: 64,
        driverName: 'Rajesh Kumar',
        latitude: 28.6139,
        longitude: 77.2090
    },
    {
        plateNumber: 'RJ-14-GH-1284',
        deviceId: 'GPS-1284',
        model: 'Ashok Leyland 2518',
        type: 'Truck',
        status: 'Stopped',
        fuelLevel: 45,
        currentSpeed: 0,
        driverName: 'Suresh Singh',
        latitude: 28.7041,
        longitude: 77.1025
    },
    {
        plateNumber: 'DL-01-BK-5521',
        deviceId: 'GPS-5521',
        model: 'BharatBenz 3123R',
        type: 'Truck',
        status: 'Idle',
        fuelLevel: 12,
        currentSpeed: 0,
        driverName: 'Amit Sharma',
        latitude: 28.5355,
        longitude: 77.3910
    },
];

const seedVehicles = async () => {
    try {
        await connectDB();
        await Vehicle.deleteMany();
        await Vehicle.insertMany(vehicles);
        console.log('✅ GPS Sample Vehicles Seeded');
        process.exit();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

seedVehicles();
