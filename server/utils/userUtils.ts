import jwt from 'jsonwebtoken';
import path from 'path'
import dotenv from "dotenv";
import User from '../models/User';
import { Request } from 'express';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });


export async function validateUser(req: Request): Promise<{ userId: string, user: any } | boolean> {
    try {
        const { authorization } = req.headers;

        if (!authorization) return Promise.resolve(false);

        const userId = tokenToUserId(authorization);
        if (!userId) return Promise.resolve(false);

        const user = await User.findOne({ userId });

        if (!user) return Promise.resolve(false);

        return Promise.resolve({ userId, user });
    } catch (error) {
        throw error;
    }
}


export function tokenToUserId(token: string) {
    const SECRET_KEY = process.env.SECRET_KEY!;
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY) as { userId: string };
        return decodedToken.userId;
    } catch (error) {
        return undefined;
    }
}