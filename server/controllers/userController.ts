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
            email: email.toLowerCase(),
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
            credits: {
                available: '10',
                onHold: '0'
            }
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

const postLogin = async (req: Request, res: Response): Promise<any> => {

    try {
        const { email, password } = req.body; //Get credentials from body
        if (!email || !password) return res.status(400).json({ error: "Credentials not provided correctly" })

        const user = await User.findOne({ email }); //Check if user exists
        console.log('user', user)
        if (!user) return res.status(400).json({ error: "User does not exists" });

        const validPassword = await bcrypt.compare(password, user.password); //Validate password from DB with the one that got provided
        if (!validPassword) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign({ userId: user.userId }, SECRET_KEY); //Create a JWT from the user_id and secret key
        res.status(200).json({ token });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const putAvailableCredits = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req, res);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });
        const currentCredits = Number(validatedUser.user.credits.available);
        const newCredits = Number(req.body.amount)
        await User.updateOne(
            { userId: validatedUser.userId },
            {
                $set: {
                    'credits.available': currentCredits + newCredits,
                },
            }
        );
        const updatedUser = await User.findOne({ userId: validatedUser.userId })

        res.status(200).json({ message: 'Available Credits Changed', credits: updatedUser.credits });
    } catch (error) {
        console.error("Error in putAvailableCredits:", error);
        res.status(500).json({ error: "Internal server error in putAvailableCredits" });
    }
}

const putOnHoldCredits = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req, res);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });
        const currentCredits = Number(validatedUser.user.credits.onHold);
        const newCredits = Number(req.body.amount)
        await User.updateOne(
            { userId: validatedUser.userId },
            {
                $set: {
                    'credits.onHold': currentCredits + newCredits,
                },
            }
        );

        const updatedUser = await User.findOne({ userId: validatedUser.userId })

        res.status(200).json({ message: 'OnHold Credits Changed ', credits: updatedUser.credits });
    } catch (error) {
        console.error("Error in putOnHoldCredits:", error);
        res.status(500).json({ error: "Internal server error in putOnHoldCredits" });
    }
};


export default {
    postRegister,
    getDriver,
    getUser,
    putCar,
    putTripsAsDriver,
    putAvailableCredits,
    putOnHoldCredits,
    postLogin,
}