import { Request, Response } from 'express';
import Client from '../models/Client';
import Vehicle from '../models/Vehicle';
import { emitClientUpdate, emitBillingUpdate } from '../socket';

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.find();

        const clientsWithStats = await Promise.all(clients.map(async (client) => {
            const totalVehicles = await Vehicle.countDocuments({ clientId: client._id });
            const activeVehicles = await Vehicle.countDocuments({ clientId: client._id, status: 'Moving' });

            return {
                ...client.toObject(),
                totalVehicles,
                activeVehicles
            };
        }));

        res.status(200).json({ success: true, clients: clientsWithStats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching clients' });
    }
};

export const createClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json({ success: true, client });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid client data' });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndUpdate(id, req.body, { new: true });
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

        emitClientUpdate(client);
        res.status(200).json({ success: true, client });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data' });
    }
};

export const updateClientBilling = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { billingDue, billingPaid, monthlySubscriptionFee } = req.body;

        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

        if (billingDue !== undefined) (client as any).billingDue = billingDue;
        if (billingPaid !== undefined) (client as any).billingPaid = billingPaid;
        if (monthlySubscriptionFee !== undefined) (client as any).monthlySubscriptionFee = monthlySubscriptionFee;

        await client.save();

        // Emit updates
        emitClientUpdate(client);

        // Fetch total billing stats to emit
        const allClients = await Client.find();
        const totalDue = allClients.reduce((acc, c) => acc + ((c as any).billingDue || 0), 0);
        const totalPaid = allClients.reduce((acc, c) => acc + ((c as any).billingPaid || 0), 0);

        emitBillingUpdate({ totalDue, totalPaid });

        res.status(200).json({ success: true, client });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Billing update failed' });
    }
};

export const getClientVehicles = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vehicles = await Vehicle.find({ clientId: id });
        res.status(200).json({ success: true, vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching terminal access' });
    }
};

export const getBillingStats = async (req: Request, res: Response) => {
    try {
        const clients = await Client.find();
        const totalDue = clients.reduce((acc, c: any) => acc + (c.billingDue || 0), 0);
        const totalPaid = clients.reduce((acc, c: any) => acc + (c.billingPaid || 0), 0);

        res.status(200).json({
            success: true,
            billing: { totalDue, totalPaid }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching billing stats' });
    }
};
