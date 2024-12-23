import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.header("authorization")?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }

        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = typeof decoded === 'object' ? decoded.userId : decoded;
        next();
        
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Token is not valid' });
        return;
    }
};