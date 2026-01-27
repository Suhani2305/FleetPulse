import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        name?: string;
    };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.authorization) {
        token = req.headers.authorization; // Handling cases where 'Bearer' might be missing
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user?.role} is not authorized to access this route`
            });
        }
        next();
    };
};
