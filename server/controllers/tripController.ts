import { Request, Response } from 'express';
import path from 'path'
import dotenv from "dotenv";
import { validateUser } from '../utils/userUtils.js';
import Trip from '../models/Trip.js';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const postCreate = async (req: Request, res: Response): Promise<any> => {
    try {
        const validUser = validateUser(req);
        if (!validUser) return res.status(401).json({ error: "Authentication failed" });
        const { departure, destination, date, totalTime, seats, services, car, price, driverId, passengerIDs, successful } = req.body;

        await Trip.insertMany({
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
        return res.status(200).json({ trips })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default {
    postCreate,
    getFilteredTrips
}