import jwt from 'jsonwebtoken';
import path from 'path'
import dotenv from "dotenv";
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export function validateUser(req: Request) {
    try {
        const { authorization } = req.headers;
        if (!authorization) return false;

        const userId = tokenToUserId(authorization);
        if (!userId) return false;

        const user = User.findOne({ userId });
        if (!user) return false;

        return true;
    } catch (error) {
        throw error;
    }
}

export function tokenToUserId(token: string) {
    const SECRET_KEY = process.env.SECRET_KEY!;
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY) as { userId: string }; //Verify the token with the secret key
        return decodedToken.userId; //Return the user_id from the token payload
    } catch (error) {
        //console.error(error);
        return undefined;
    }
}