"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const userUtils_js_1 = require("../utils/userUtils.js");
const Trip_js_1 = __importDefault(require("../models/Trip.js"));
const User_js_1 = __importDefault(require("../models/User.js"));
const userController_js_1 = __importDefault(require("./userController.js"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const postCreate = async (req, res) => {
    try {
        const validUser = (0, userUtils_js_1.validateUser)(req);
        if (!validUser)
            return res.status(401).json({ error: "Authentication failed" });
        const newTrip = await Trip_js_1.default.insertMany([req.body]);
        return res.status(201).json({ stauts: 201, message: 'Successfully created trip', trip: newTrip[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getFilteredTrips = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        const { departureCountry, departureCity, destinationCountry, destinationCity, date, seats } = req.query;
        let params;
        if (!destinationCountry && !destinationCity) {
            params = {
                'departure.country': departureCountry,
                'departure.city': departureCity,
                date: { $gte: date },
                'seats.available': { $gte: seats },
                'driverID': { $ne: validatedUser.userId }
            };
        }
        else {
            params = {
                'departure.country': departureCountry,
                'departure.city': departureCity,
                'destination.country': destinationCountry,
                'destination.city': destinationCity,
                date: { $gte: date },
                'seats.available': { $gte: seats },
                'driverID': { $ne: validatedUser.userId }
            };
        }
        //todo remove any
        const trips = await Trip_js_1.default.find(params);
        let formedTrips = [];
        for (const trip of trips) {
            const driver = await userController_js_1.default.getDriver(trip.driverID);
            formedTrips.push({ trip, driver });
        }
        return res.status(200).json({ trips: formedTrips });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const putApprovePassenger = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        const { tripId, passengerId, bookingId, totalCredits } = req.body.data;
        await Trip_js_1.default.updateOne({ _id: tripId, "passengerIDs.bookingId": bookingId }, { $set: { "passengerIDs.$.status": "Approved" } }, { new: true });
        const creditsInQuestion = Number(totalCredits);
        const passenger = await User_js_1.default.findOne({ userId: passengerId });
        passenger.expoPushToken && (0, userUtils_js_1.sendPushNotification)(passenger.expoPushToken, 'The trip you booked has been accepted!', 'Be prepared!');
        const currentPassengerOnHold = Number(passenger.credits.onHold);
        await User_js_1.default.updateOne({ userId: passenger.userId }, { $set: { 'credits.onHold': currentPassengerOnHold - creditsInQuestion } });
        const currentDriverEarningOnHold = Number(validatedUser.user.credits.earningsOnHold);
        await User_js_1.default.updateOne({ userId: validatedUser.userId }, { $set: { 'credits.earningsOnHold': currentDriverEarningOnHold + creditsInQuestion } });
        const updatedTrip = await Trip_js_1.default.findOne({ _id: tripId });
        res.status(200).json({ message: 'Trip edited successfully', trip: updatedTrip });
    }
    catch (error) {
        console.error("Error in putCar:", error);
        res.status(500).json({ error: "Internal server error in putCar" });
    }
};
const putRejectPassenger = async (req, res) => {
    try {
        //what we need? 
        //trip id, passengerid, driverid 
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        //change trip passengersid status to Approved  WORKS
        //onhold credits from passenger deduct  WORKS
        //passengers credits goes to driver creits(onhold) WORKS
        const { tripId, passengerId, bookingId, totalCredits } = req.body.data;
        const trip = await Trip_js_1.default.findOne({ _id: tripId });
        const passenger = await Trip_js_1.default.findOne({ _id: tripId, "passengerIDs.bookingId": bookingId }, { "passengerIDs.$": 1 });
        const seats = passenger.passengerIDs[0].seats;
        await Trip_js_1.default.updateOne({ _id: tripId, "passengerIDs.bookingId": bookingId }, {
            $set: { "passengerIDs.$.status": "Rejected" },
            $inc: { 'seats.available': seats }
        });
        const creditsInQuestion = Number(totalCredits);
        //find passenger by id
        const user = await User_js_1.default.findOne({ userId: passengerId });
        user.expoPushToken && (0, userUtils_js_1.sendPushNotification)(user.expoPushToken, 'The trip you booked has been rejected!', 'Good luck next time!');
        const currentPassengerOnHold = Number(user.credits.onHold);
        const currentPassengerAvailable = Number(user.credits.available);
        await User_js_1.default.updateOne({ userId: user.userId }, {
            $set: {
                'credits.onHold': currentPassengerOnHold - creditsInQuestion,
                'credits.available': currentPassengerAvailable + creditsInQuestion,
            },
        });
        const updatedTrip = await Trip_js_1.default.findOne({ _id: tripId });
        res.status(200).json({ message: 'Trip edited successfully', trip: updatedTrip });
    }
    catch (error) {
        console.error("Error in putRejectPassenger:", error);
        res.status(500).json({ error: "Internal server error in putRejectPassenger" });
    }
};
//on reject update seats available of trip
const putMakeRequest = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_js_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user)
            return res.status(401).json({ error: validatedUser });
        // add validateduser to trips passengers list
        // add trip to users array trips as passanger
        //
        //make - seats
        const { tripId, seats } = req.body.data;
        await Trip_js_1.default.updateOne({ _id: tripId }, {
            $push: {
                passengerIDs: {
                    bookingId: (0, uuid_1.v4)(),
                    userId: validatedUser.user.userId,
                    name: validatedUser.user.name,
                    status: 'Pending',
                    seats: seats
                },
            },
            $inc: { "seats.available": -seats },
        });
        const trip = await Trip_js_1.default.findOne({ _id: tripId });
        const currentPassengerOnHold = Number(validatedUser.user.credits.onHold);
        const currentPassengerAvailable = Number(validatedUser.user.credits.available);
        const totalSum = Number(seats * trip.price);
        await User_js_1.default.updateOne({ userId: validatedUser.user.userId }, {
            $push: { tripsAsPassengerIDs: tripId },
            $set: {
                'credits.onHold': currentPassengerOnHold + totalSum,
                'credits.available': currentPassengerAvailable - totalSum,
            },
        });
        const driver = await User_js_1.default.findOne({ userId: trip.driverID });
        driver.expoPushToken && (0, userUtils_js_1.sendPushNotification)(driver.expoPushToken, 'New Request to your trip!', 'Accept or Reject it!');
        const updatedTrip = await Trip_js_1.default.findOne({ _id: tripId });
        res.status(200).json({ message: 'Trip edited successfully', trip: updatedTrip });
    }
    catch (error) {
        console.error("Error in putMakeRequest:", error);
        res.status(500).json({ error: "Internal server error in putMakeRequest" });
    }
};
exports.default = {
    postCreate,
    getFilteredTrips,
    putApprovePassenger,
    putRejectPassenger,
    putMakeRequest
};
