import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Role Verification Check
        if (role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `This account is associated with the ${user.role} role. Please log in using the correct role.`

            });
        }

        // Generate JWT
        const secret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
        const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN as any) || '1h';

        const token = jwt.sign(
            { id: (user._id as any).toString(), role: user.role, name: user.name },
            secret,
            { expiresIn: expiresIn }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

export const register = async (req: any, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const creatorName = req.user ? req.user.name : 'Super Admin';

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            passwordHash: password,
            role,
            createdBy: creatorName || 'System Admin'
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching users' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        if (password) {
            user.passwordHash = password;
        }

        await user.save();

        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error updating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error deleting user' });
    }
};
