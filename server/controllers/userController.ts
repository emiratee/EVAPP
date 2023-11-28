import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import path from 'path'
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const SECRET_KEY = process.env.SECRET_KEY!;
const postRegister = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        if (!name || !email || !phoneNumber || !password) return res.status(400).json({ error: "Credentials not provided correctly" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "Account with this E-Mail already exists" });

        const userId = uuidv4();
        await User.insertMany({
            userId,
            name,
            password: await bcrypt.hash(password, 10),
            email,
            phoneNumber,
            memberSince: Date.now(),
            cars: [],
            passengerRating: {
                totalReviews: 0,
                totalRating: 0,
                averageRating: 0
            },
            driverRating: {
                totalReviews: 0,
                totalRating: 0,
                averageRating: 0
            },
            tripsAsDriverIDs: [],
            tripsAsPassengerIDs: [],
            credits: '0'
        });
        const token = jwt.sign({ userId }, SECRET_KEY);
        res.status(201).json({ token });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default {
    postRegister
}