import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('📱 New Client Connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('📱 Client Disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitVehicleUpdate = (data: any) => {
    if (io) io.emit('vehicle-update', data);
};

export const emitClientUpdate = (data: any) => {
    if (io) io.emit('client-update', data);
};

export const emitBillingUpdate = (data: any) => {
    if (io) io.emit('billing-update', data);
};

export const emitGeofenceUpdate = (data: any) => {
    if (io) io.emit('geofence-update', data);
};
