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
const getDriver = async (req, res) => {
    try {
        const { driverId } = req.params;
        if (!driverId)
            return res.status(400).json({ error: "Credentials not provided correctly" });
        const driver = await User_js_1.default.findOne({ driverId });
        if (!driver)
            return res.status(400).json({ error: "No driver with this ID" });
        const { _id, userId, password, email, phoneNumber, credits, __v, ...filteredDriver } = driver.toObject();
        return res.status(200).json({ driver: filteredDriver });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = {
    postRegister,
    getDriver
};
