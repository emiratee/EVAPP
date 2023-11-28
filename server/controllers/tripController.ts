import { Request, Response } from 'express';
import path from 'path'
import dotenv from "dotenv";
import { validateUser } from '../utils/userUtils.js';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const postCreate = async (req: Request, res: Response): Promise<any> => {
    try {
        const validUser = validateUser(req);
        if (!validUser) return res.status(401).json({ error: "Authentication failed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default {
    postCreate
}