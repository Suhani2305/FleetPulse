import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle';
import Client from './models/Client';
import Transporter from './models/Transporter';
import connectDB from './config/db';

dotenv.config();

const clientsData = [
    { name: 'Reliance Logistics', contactPerson: 'Anil Ambani', email: 'anil@reliance.com', status: 'Premium', billingDue: 45000, billingPaid: 2450000 },
    { name: 'Adani Ports', contactPerson: 'Gautam Adani', email: 'gautam@adani.com', status: 'Enterprise', billingDue: 842000, billingPaid: 1250000 },
    { name: 'Tata Steel', contactPerson: 'Ratan Tata', email: 'ratan@tata.com', status: 'Enterprise', billingDue: 0, billingPaid: 850000 },
];

const transportersData = [
    { name: 'VRL Logistics', contactPerson: 'Vijay Sankeshwar', email: 'info@vrl.com', status: 'Active' },
    { name: 'Allied Roadlines', contactPerson: 'Sunil Kumar', email: 'sunil@allied.com', status: 'Active' },
    { name: 'SafeXpress', contactPerson: 'Pawan Jain', email: 'pawan@safexpress.com', status: 'Active' }
];

const devices = [
    { plateNumber: 'HR-26-CZ-9021', deviceId: 'IMEI-864001', model: 'TATA PRIMA 4028.S', type: 'Truck' },
    { plateNumber: 'RJ-14-GH-1284', deviceId: 'IMEI-864002', model: 'ASHOK LEYLAND 2518', type: 'Truck' },
    { plateNumber: 'DL-01-BK-5521', deviceId: 'IMEI-864003', model: 'BHARATBENZ 3123R', type: 'Truck' },
    { plateNumber: 'UP-16-AX-0012', deviceId: 'IMEI-864004', model: 'MAHINDRA BLAZO X', type: 'Truck' },
    { plateNumber: 'MH-04-PP-7721', deviceId: 'IMEI-864005', model: 'VOLVO FMX 440', type: 'Truck' },
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing existing data...');
        await Client.deleteMany({});
        await Vehicle.deleteMany({});
        await Transporter.deleteMany({});

        console.log('🚀 Seeding Clients...');
        const createdClients = await Client.insertMany(clientsData);

        console.log('🚀 Seeding Transporters...');
        const createdTransporters = await Transporter.insertMany(transportersData);

        console.log('🚀 Seeding Vehicles...');
        const vehiclesWithData = devices.map((d, i) => ({
            ...d,
            clientId: createdClients[i % createdClients.length]._id,
            transporterId: createdTransporters[i % createdTransporters.length]._id
        }));
        await Vehicle.insertMany(vehiclesWithData);

        console.log('✅ Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
