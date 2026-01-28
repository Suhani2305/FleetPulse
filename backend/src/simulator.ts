import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Base URL from env or fallback to localhost
const PORT = process.env.PORT || 4000;
const API_BASE_URL = process.env.VITE_API_BASE_URL || `http://localhost:${PORT}`;

// ✅ Full endpoint
const GPS_PING_URL = `${API_BASE_URL}/api/v1/gps/ping`;

// List of devices from seed data
const devices = [
    { id: 'IMEI-864001', lat: 28.6139, lng: 77.2090, name: 'Truck 1' },
    { id: 'IMEI-864002', lat: 28.7041, lng: 77.1025, name: 'Truck 2' },
    { id: 'IMEI-864003', lat: 28.5355, lng: 77.3910, name: 'Truck 3' },
    { id: 'IMEI-864004', lat: 19.0760, lng: 72.8777, name: 'Truck 4' },
    { id: 'IMEI-864005', lat: 13.0827, lng: 80.2707, name: 'Truck 5' },
];

const simulateMove = (coord: number): number => {
    return coord + (Math.random() - 0.5) * 0.005; // small random move
};

const sendPing = async (device: any) => {
    device.lat = simulateMove(device.lat);
    device.lng = simulateMove(device.lng);

    const payload = {
        deviceId: device.id,
        lat: device.lat,
        lng: device.lng,
        speed: Math.floor(Math.random() * 80) + 20, // 20–100 km/h
        fuel: Math.floor(Math.random() * 20) + 60, // 60–80%
        satellites: Math.floor(Math.random() * 8) + 8, // 8-16 satellites
        gsmSignal: Math.floor(Math.random() * 30) + 70, // 70-100% signal
        internalBattery: Math.floor(Math.random() * 20) + 80, // 80-100% battery
        timestamp: new Date().toISOString(),
    };

    try {
        await axios.post(GPS_PING_URL, payload);
        console.log(
            `📡 SENT → ${device.id} | ${device.lat.toFixed(4)}, ${device.lng.toFixed(4)} | SPD ${payload.speed} | SATS: ${payload.satellites}`
        );
    } catch (err: any) {
        console.error(`FAILED → ${device.id}`, err.message);
    }
};

const startSimulation = () => {
    console.log('GPS SIMULATOR STARTED');


    setInterval(() => {
        const randomDevice =
            devices[Math.floor(Math.random() * devices.length)];
        sendPing(randomDevice);
    }, 2000);
};

startSimulation();
