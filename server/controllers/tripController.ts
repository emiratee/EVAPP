import { Request, Response } from 'express';
import path from 'path'
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { sendPushNotification, validateUser } from '../utils/userUtils.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import userController from './userController.js'

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const postCreate = async (req: Request, res: Response): Promise<any> => {
    try {
        const validUser = validateUser(req);
        if (!validUser) return res.status(401).json({ error: "Authentication failed" });


        const newTrip = await Trip.insertMany([req.body]);

        return res.status(201).json({ stauts: 201, message: 'Successfully created trip', trip: newTrip[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getFilteredTrips = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req);
        const { departureCountry, departureCity, destinationCountry, destinationCity, date, seats } = req.query;
        let params

        if (!destinationCountry && !destinationCity) {
            params = {
                'departure.country': departureCountry,
                'departure.city': departureCity,
                date: { $gte: date },
                'seats.available': { $gte: seats },
                'driverID': { $ne: validatedUser.userId }
            };
        } else {
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
        const trips = await Trip.find(params);
        let formedTrips: any[] = [];
        for (const trip of trips) {
            const driver = await userController.getDriver(trip.driverID);
            formedTrips.push({ trip, driver });
        }
        return res.status(200).json({ trips: formedTrips })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const putApprovePassenger = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });
        const { tripId, passengerId, bookingId, totalCredits } = req.body.data;



        await Trip.updateOne(
            { _id: tripId, "passengerIDs.bookingId": bookingId },
            { $set: { "passengerIDs.$.status": "Approved" } },
            { new: true }
        );

        const creditsInQuestion = Number(totalCredits)

        const passenger = await User.findOne({ userId: passengerId });

        passenger.expoPushToken && sendPushNotification(
            passenger.expoPushToken,
            'The trip you booked has been accepted!',
            'Be prepared!'
        )

        const currentPassengerOnHold = Number(passenger.credits.onHold);

        await User.updateOne(
            { userId: passenger.userId },
            { $set: { 'credits.onHold': currentPassengerOnHold - creditsInQuestion } }
        );
        const currentDriverEarningOnHold = Number(validatedUser.user.credits.earningsOnHold);

        await User.updateOne(
            { userId: validatedUser.userId },
            { $set: { 'credits.earningsOnHold': currentDriverEarningOnHold + creditsInQuestion } }
        );

        const updatedTrip = await Trip.findOne({ _id: tripId })

        res.status(200).json({ message: 'Trip edited successfully', trip: updatedTrip });
    } catch (error) {
        console.error("Error in putCar:", error);
        res.status(500).json({ error: "Internal server error in putCar" });
    }
};



const putRejectPassenger = async (req: Request, res: Response): Promise<any> => {
    try {

        //what we need? 

        //trip id, passengerid, driverid 
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });
        //change trip passengersid status to Approved  WORKS
        //onhold credits from passenger deduct  WORKS
        //passengers credits goes to driver creits(onhold) WORKS

        const { tripId, passengerId, bookingId, totalCredits } = req.body.data;
        const trip = await Trip.findOne({ _id: tripId });

        const passenger = await Trip.findOne(
            { _id: tripId, "passengerIDs.bookingId": bookingId },
            { "passengerIDs.$": 1 }
        )

        const seats = passenger.passengerIDs[0].seats;


        await Trip.updateOne(
            { _id: tripId, "passengerIDs.bookingId": bookingId },
            {
                $set: { "passengerIDs.$.status": "Rejected" },
                $inc: { 'seats.available': seats }
            }
        );


        const creditsInQuestion = Number(totalCredits)


        //find passenger by id
        const user = await User.findOne({ userId: passengerId });

        user.expoPushToken && sendPushNotification(
            user.expoPushToken,
            'The trip you booked has been rejected!',
            'Good luck next time!'
        )

        const currentPassengerOnHold = Number(user.credits.onHold);
        const currentPassengerAvailable = Number(user.credits.available);

        await User.updateOne(
            { userId: user.userId },
            {
                $set: {
                    'credits.onHold': currentPassengerOnHold - creditsInQuestion,
                    'credits.available': currentPassengerAvailable + creditsInQuestion,
                },
            }
        );


        const updatedTrip = await Trip.findOne({ _id: tripId })

        res.status(200).json({ message: 'Trip edited successfully', trip: updatedTrip });
    } catch (error) {
        console.error("Error in putRejectPassenger:", error);
        res.status(500).json({ error: "Internal server error in putRejectPassenger" });
    }
};
//on reject update seats available of trip

const putMakeRequest = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId || !validatedUser.user) return res.status(401).json({ error: validatedUser });

        // add validateduser to trips passengers list
        // add trip to users array trips as passanger
        //
        //make - seats


        const { tripId, seats } = req.body.data

        await Trip.updateOne(
            { _id: tripId },
            {
                $push: {
                    passengerIDs: {
                        bookingId: uuidv4(),
                        userId: validatedUser.user.userId,
                        name: validatedUser.user.name,
                        status: 'Pending',
                        seats: seats
                    },
                },
                $inc: { "seats.available": -seats },
            }
        )

        const trip = await Trip.findOne({ _id: tripId })
        const currentPassengerOnHold = Number(validatedUser.user.credits.onHold);
        const currentPassengerAvailable = Number(validatedUser.user.credits.available);

        const totalSum = Number(seats * trip.price)
        await User.updateOne(
            { userId: validatedUser.user.userId },
            {
                $push: { tripsAsPassengerIDs: tripId },


                $set: {
                    'credits.onHold': currentPassengerOnHold + totalSum,
                    'credits.available': currentPassengerAvailable - totalSum,
                },


            }
        );
        const driver = await User.findOne({ userId: trip.driverID });

        driver.expoPushToken && sendPushNotification(
            driver.expoPushToken,
            'New Request to your trip!',
            'Accept or Reject it!'
        )

        const updatedTrip = await Trip.findOne({ _id: tripId })

        res.status(200).json({ message: 'Trip edited successfully', trip: updatedTrip });
    } catch (error) {
        console.error("Error in putMakeRequest:", error);
        res.status(500).json({ error: "Internal server error in putMakeRequest" });
    }
};

export default {
    postCreate,
    getFilteredTrips,
    putApprovePassenger,
    putRejectPassenger,
    putMakeRequest
}