import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import path from 'path'
import dotenv from "dotenv";
import { validateUser } from '../utils/userUtils.js';
import Car from '../models/Car.js';
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
            driverId: '12345',
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

const getDriver = async (driverId): Promise<any> => {
    try {
        //if (!driverId) return res.status(400).json({ error: "Credentials not provided correctly" });

        const driver = await User.findOne({ userId: driverId });

        //if (!driver) return res.status(400).json({ error: "No driver with this ID" });

        const { _id, userId, password, email, phoneNumber, credits, __v, ...filteredDriver } = driver.toObject();

        return filteredDriver;
    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: "Internal server error" });
    }
}


const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req, res);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        const { user } = validatedUser;

        const { _id, password, __v, ...filteredUser } = user.toObject(); // Filter out unnecessary properties

        res.status(200).json(filteredUser); // Return the filtered user
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ error: "Internal server error in getUser" });
    }
};

const putCar = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req, res);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        await User.updateOne(
            { userId: validatedUser.userId },
            {
                $push: {
                    cars: req.body,
                },
            }
        );

        const updatedUser = await User.findOne({ userId: validatedUser.userId })

        res.status(200).json({ message: 'Car added successfully', car: updatedUser.cars[updatedUser.cars.length - 1] });
    } catch (error) {
        console.error("Error in putCar:", error);
        res.status(500).json({ error: "Internal server error in putCar" });
    }
};


const putTripsAsDriver = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req, res);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        await User.updateOne(
            { userId: validatedUser.userId },
            {
                $push: {
                    tripsAsDriverIDs: req.body._id,
                },
            }
        );

        // const updatedUser = await User.findOne({ userId: validatedUser.userId })

        res.status(200).json({ message: 'Trip as Driver added successfully' });
    } catch (error) {
        console.error("Error in putCar:", error);
        res.status(500).json({ error: "Internal server error in putCar" });
    }
};

export default {
    postRegister,
    getDriver,
    getUser,
    putCar,
    putTripsAsDriver
}