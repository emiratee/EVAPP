import { Request, Response } from 'express';
import path from 'path'
import dotenv from "dotenv";
import { validateUser } from '../utils/userUtils.js';
import Trip from '../models/Trip.js';
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
        const validUser = validateUser(req);
        if (!validUser) return res.status(401).json({ error: "Authentication failed" });

        const { departureCountry, departureCity, destinationCountry, destinationCity, date, seats } = req.query;
        const params = {
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'destination.country': destinationCountry,
            'destination.city': destinationCity,
            date,
            'seats.available': { $gte: seats }
        };

        const trips = await Trip.find(params);
        let formedTrips: [] = [];
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

export default {
    postCreate,
    getFilteredTrips
}