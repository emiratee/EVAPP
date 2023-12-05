import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { validateUser, sendPushNotification } from '../utils/userUtils.js';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const SECRET_KEY = process.env.SECRET_KEY!;
const postRegister = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, phoneNumber, password, imageUrl, expoPushToken } = req.body;
        if (!name || !email || !phoneNumber || !password) return res.status(400).json({ error: "Credentials not provided correctly" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "Account with this E-Mail already exists" });

        const userId = uuidv4();
        await User.insertMany({
            userId,
            name,
            imageUrl,
            expoPushToken,
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
                onHold: '0',
                earningsOnHold: '0',
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

const getDriver = async (driverId: string): Promise<any> => {
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
        const validatedUser = await validateUser(req);
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
        const validatedUser = await validateUser(req);
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
        const validatedUser = await validateUser(req);
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
        const validatedUser = await validateUser(req);
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
        const validatedUser = await validateUser(req);
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

const putEarningsCredits = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });
        const currentCredits = Number(validatedUser.user.credits.earningsOnHold);
        const newCredits = Number(req.body.amount)
        await User.updateOne(
            { userId: validatedUser.userId },
            {
                $set: {
                    'credits.earningsOnHold': currentCredits + newCredits,
                },
            }
        );

        const updatedUser = await User.findOne({ userId: validatedUser.userId })

        res.status(200).json({ message: 'earningsOnHold Credits Changed ', credits: updatedUser.credits });
    } catch (error) {
        console.error("Error in putearningsOnHoldCredits:", error);
        res.status(500).json({ error: "Internal server error in putearningsOnHoldCredits" });
    }
};


const getHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        const { user } = validatedUser;

        const driverTrips = await Trip.find({ _id: { $in: user.tripsAsDriverIDs } });
        const passengerTrips = await Trip.find({ _id: { $in: user.tripsAsPassengerIDs } });
        const trips = [...driverTrips, ...passengerTrips];

        const tripsWithDrivers = await Promise.all(trips.map(async (trip) => {
            const driver = await getDriver(trip.driverID);
            return { trip, driver };
        }));


        res.status(200).json({ data: tripsWithDrivers }); // Return the filtered user
    } catch (error) {
        console.error("Error in getHistory:", error);
        res.status(500).json({ error: "Internal server error in getHistory" });
    }
};


async function putUpdateAccount(req: Request, res: Response): Promise<any> {
    try {
        // first validate user
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        const { currentPassword, newPassword, image } = req.body;

        // check if there's an image
        if (image) {
            await User.updateOne({ userId: validatedUser.user.userId }, { $set: { imageUrl: image } });
            return res.status(200).json({ message: 'Image changed successfully' });
        }

        // validate if required password parameters are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Required parameters not provided correctly' });
        }
        const { user } = validatedUser;
        // Check if the current password is correct
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        // hash and update the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ userId: user.userId }, { $set: { password: hashedPassword } });
        res.status(200).json({ message: 'Password changed successfully' });


    } catch (error) {
        console.error("Error in updateAccount:", error);
        res.status(500).json({ error: "Internal server error in updateAccount" });
    }
}

const putEarningsToAvailable = async (req: Request, res: Response): Promise<any> => {
    try {
        //validating user
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        //current on hold credits
        const currentOnHoldEarnings = Number(validatedUser.user.credits.earningsOnHold);
        const currentAvailable = Number(validatedUser.user.credits.available);

        const { totalCredits } = req.body.data

        await User.updateOne(
            { userId: validatedUser.userId },
            {
                $set: {
                    'credits.earningsOnHold': currentOnHoldEarnings - totalCredits,
                    'credits.available': currentAvailable + Number(totalCredits),
                },
            }
        );

        const updatedUser = await User.findOne({ userId: validatedUser.userId })

        res.status(200).json({ message: 'putEarningsToAvailable Credits Changed ', credits: updatedUser.credits });
    } catch (error) {
        console.error("Error in putEarningsToAvailable:", error);
        res.status(500).json({ error: "Internal server error in putEarningsToAvailable" });
    }
};

const putAddReview = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('alos here')
        //validating user
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        //driver ID
        const { tripId, driverId, rating } = req.body.data

        const driver = await User.findOne({ userId: driverId });
        console.log(driver)
        const currentTotalReviews = Number(driver.driverRating.totalReviews);
        const currentTotalRating = Number(driver.driverRating.totalRating);

        //add reviews to driver
        await User.updateOne(
            { userId: driverId },
            {
                $set: {
                    'driverRating.totalReviews': currentTotalReviews + 1,
                    'driverRating.totalRating': currentTotalRating + Number(rating),
                },
            }
        );

        //change trip reviwed status to true for user (which is a passenger)
        await Trip.updateOne(
            { _id: tripId, "passengerIDs.userId": validatedUser.userId },
            {
                $set: { "passengerIDs.$.reviewed": true },
            }
        );

        res.status(200).json({ message: 'putAddReview Changed ' });
    } catch (error) {
        console.error("Error in putAddReview:", error);
        res.status(500).json({ error: "Internal server error in putAddReview" });
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
    getHistory,
    putEarningsCredits,
    putUpdateAccount,
    putEarningsToAvailable,
    putAddReview
}