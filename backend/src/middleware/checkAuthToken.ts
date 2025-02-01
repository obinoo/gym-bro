import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.header("authorization")?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'No authorization token, access denied' });
            return;
        }

        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }

        // Verify the access token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // Access token has expired or is invalid
                res.status(401).json({ message: 'Token is invalid or expired' });
                return;
            }
            
            // Access token is valid
            req.user = (decoded as any).email;
            next();
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};