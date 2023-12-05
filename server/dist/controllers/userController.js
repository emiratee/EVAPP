"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const Trip_js_1 = __importDefault(require("../models/Trip.js"));
const User_js_1 = __importDefault(require("../models/User.js"));
const userUtils_js_1 = require("../utils/userUtils.js");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const SECRET_KEY = process.env.SECRET_KEY;
const postRegister = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, imageUrl, expoPushToken } = req.body;
        if (!name || !email || !phoneNumber || !password)
            return res.status(400).json({ error: "Credentials not provided correctly" });
        const user = await User_js_1.default.findOne({ email });
        if (user)
            return res.status(400).json({ error: "Account with this E-Mail already exists" });
        const userId = (0, uuid_1.v4)();
        await User_js_1.default.insertMany({
            userId,
            name,
            imageUrl,
            expoPushToken,
            password: await bcrypt_1.default.hash(password, 10),
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
        const token = jsonwebtoken_1.default.sign({ userId }, SECRET_KEY);
        res.status(201).json({ token });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getDriver = async (driverId) => {
    try {
        //if (!driverId) return res.status(400).json({ error: "Credentials not provided correctly" });
        const driver = await User_js_1.default.findOne({ userId: driverId });
        //if (!driver) return res.status(400).json({ error: "No driver with this ID" });
        const { _id, password, email, phoneNumber, credits, __v, ...filteredDriver } = driver.toObject();
        return filteredDriver;
    }
    catch (error) {
        console.error(error);
        //res.status(500).json({ error: "Internal server error" });
    }
};
const getUser = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const { user } = validatedUser;
        const { _id, password, __v, ...filteredUser } = user.toObject(); // Filter out unnecessary properties
        res.status(200).json(filteredUser); // Return the filtered user
    }
    catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ error: "Internal server error in getUser" });
    }
};
const putCar = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, {
            $push: {
                cars: req.body,
            },
        });
        const updatedUser = await User_js_1.default.findOne({ userId: validatedUser.userId });
        res.status(200).json({ message: 'Car added successfully', car: updatedUser.cars[updatedUser.cars.length - 1] });
    }
    catch (error) {
        console.error("Error in putCar:", error);
        res.status(500).json({ error: "Internal server error in putCar" });
    }
};
const putTripsAsDriver = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, {
            $push: {
                tripsAsDriverIDs: req.body._id,
            },
        });
        // const updatedUser = await User.findOne({ userId: validatedUser.userId })
        res.status(200).json({ message: 'Trip as Driver added successfully' });
    }
    catch (error) {
        console.error("Error in putCar:", error);
        res.status(500).json({ error: "Internal server error in putCar" });
    }
};
const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body; //Get credentials from body
        if (!email || !password)
            return res.status(400).json({ error: "Credentials not provided correctly" });
        const user = await User_js_1.default.findOne({ email }); //Check if user exists
        if (!user)
            return res.status(400).json({ error: "User does not exists" });
        const validPassword = await bcrypt_1.default.compare(password, user.password); //Validate password from DB with the one that got provided
        if (!validPassword)
            return res.status(401).json({ error: "Incorrect password" });
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, SECRET_KEY); //Create a JWT from the user_id and secret key
        res.status(200).json({ token });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const putAvailableCredits = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const currentCredits = Number(validatedUser.user.credits.available);
        const newCredits = Number(req.body.amount);
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, {
            $set: {
                'credits.available': currentCredits + newCredits,
            },
        });
        const updatedUser = await User_js_1.default.findOne({ userId: validatedUser.userId });
        res.status(200).json({ message: 'Available Credits Changed', credits: updatedUser.credits });
    }
    catch (error) {
        console.error("Error in putAvailableCredits:", error);
        res.status(500).json({ error: "Internal server error in putAvailableCredits" });
    }
};
const putOnHoldCredits = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const currentCredits = Number(validatedUser.user.credits.onHold);
        const newCredits = Number(req.body.amount);
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, {
            $set: {
                'credits.onHold': currentCredits + newCredits,
            },
        });
        const updatedUser = await User_js_1.default.findOne({ userId: validatedUser.userId });
        res.status(200).json({ message: 'OnHold Credits Changed ', credits: updatedUser.credits });
    }
    catch (error) {
        console.error("Error in putOnHoldCredits:", error);
        res.status(500).json({ error: "Internal server error in putOnHoldCredits" });
    }
};
const putEarningsCredits = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const currentCredits = Number(validatedUser.user.credits.earningsOnHold);
        const newCredits = Number(req.body.amount);
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, {
            $set: {
                'credits.earningsOnHold': currentCredits + newCredits,
            },
        });
        const updatedUser = await User_js_1.default.findOne({ userId: validatedUser.userId });
        res.status(200).json({ message: 'earningsOnHold Credits Changed ', credits: updatedUser.credits });
    }
    catch (error) {
        console.error("Error in putearningsOnHoldCredits:", error);
        res.status(500).json({ error: "Internal server error in putearningsOnHoldCredits" });
    }
};
const getHistory = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const { user } = validatedUser;
        const driverTrips = await Trip_js_1.default.find({ _id: { $in: user.tripsAsDriverIDs } });
        const passengerTrips = await Trip_js_1.default.find({ _id: { $in: user.tripsAsPassengerIDs } });
        const trips = [...driverTrips, ...passengerTrips];
        const tripsWithDrivers = await Promise.all(trips.map(async (trip) => {
            const driver = await getDriver(trip.driverID);
            return { trip, driver };
        }));
        res.status(200).json({ data: tripsWithDrivers }); // Return the filtered user
    }
    catch (error) {
        console.error("Error in getHistory:", error);
        res.status(500).json({ error: "Internal server error in getHistory" });
    }
};
async function putUpdateAccount(req, res) {
    try {
        // first validate user
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const { currentPassword, newPassword, image } = req.body;
        // check if there's an image
        if (image) {
            await User_js_1.default.updateOne({ userId: validatedUser.user.userId }, { $set: { imageUrl: image } });
            return res.status(200).json({ message: 'Image changed successfully' });
        }
        // validate if required password parameters are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Required parameters not provided correctly' });
        }
        const { user } = validatedUser;
        // Check if the current password is correct
        const validPassword = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        // hash and update the new password
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await User_js_1.default.updateOne({ userId: user.userId }, { $set: { password: hashedPassword } });
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error("Error in updateAccount:", error);
        res.status(500).json({ error: "Internal server error in updateAccount" });
    }
}
const putEarningsToAvailable = async (req, res) => {
    try {
        //validating user
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        //current on hold credits
        const currentOnHoldEarnings = Number(validatedUser.user.credits.earningsOnHold);
        const currentAvailable = Number(validatedUser.user.credits.available);
        const { totalCredits } = req.body.data;
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, {
            $set: {
                'credits.earningsOnHold': currentOnHoldEarnings - totalCredits,
                'credits.available': currentAvailable + Number(totalCredits),
            },
        });
        const updatedUser = await User_js_1.default.findOne({ userId: validatedUser.userId });
        res.status(200).json({ message: 'putEarningsToAvailable Credits Changed ', credits: updatedUser.credits });
    }
    catch (error) {
        console.error("Error in putEarningsToAvailable:", error);
        res.status(500).json({ error: "Internal server error in putEarningsToAvailable" });
    }
};
exports.default = {
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
    putEarningsToAvailable
};
