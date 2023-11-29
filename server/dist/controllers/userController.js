"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_js_1 = __importDefault(require("../models/User.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const userUtils_js_1 = require("../utils/userUtils.js");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const SECRET_KEY = process.env.SECRET_KEY;
const postRegister = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        if (!name || !email || !phoneNumber || !password)
            return res.status(400).json({ error: "Credentials not provided correctly" });
        const user = await User_js_1.default.findOne({ email });
        if (user)
            return res.status(400).json({ error: "Account with this E-Mail already exists" });
        const userId = (0, uuid_1.v4)();
        await User_js_1.default.insertMany({
            userId,
            name,
            password: await bcrypt_1.default.hash(password, 10),
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
        const { _id, userId, password, email, phoneNumber, credits, __v, ...filteredDriver } = driver.toObject();
        return filteredDriver;
    }
    catch (error) {
        console.error(error);
        //res.status(500).json({ error: "Internal server error" });
    }
};
const getUser = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req, res);
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
        const validatedUser = await (0, userUtils_js_1.validateUser)(req, res);
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
        const validatedUser = await (0, userUtils_js_1.validateUser)(req, res);
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
exports.default = {
    postRegister,
    getDriver,
    getUser,
    putCar,
    putTripsAsDriver
};
