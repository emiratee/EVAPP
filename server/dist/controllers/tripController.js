"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const userUtils_js_1 = require("../utils/userUtils.js");
const Trip_js_1 = __importDefault(require("../models/Trip.js"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const postCreate = async (req, res) => {
    try {
        const validUser = (0, userUtils_js_1.validateUser)(req);
        if (!validUser)
            return res.status(401).json({ error: "Authentication failed" });
        const { departure, destination, date, totalTime, seats, services, car, price, driverId, passengerIDs, successful } = req.body;
        await Trip_js_1.default.insertMany({
            departure,
            destination,
            date,
            totalTime,
            seats,
            services,
            car,
            price,
            driverId,
            passengerIDs,
            successful
        });
        return res.status(201).json({ stauts: 201, message: 'Successfully created trip' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getFilteredTrips = async (req, res) => {
    try {
        const validUser = (0, userUtils_js_1.validateUser)(req);
        if (!validUser)
            return res.status(401).json({ error: "Authentication failed" });
        const { departureCountry, departureCity, destinationCountry, destinationCity, date, seats } = req.query;
        const params = {
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'destination.country': destinationCountry,
            'destination.city': destinationCity,
            date,
            'seats.available': { $gte: seats }
        };
        const trips = await Trip_js_1.default.find(params);
        console.log(trips);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = {
    postCreate,
    getFilteredTrips
};
