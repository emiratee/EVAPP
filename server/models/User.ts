import { carSchema } from "./Car";
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { 
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    memberSince: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        required: true
    },
    cars: [carSchema],
    passengerRating: {
        totalReviews: {
            type: String,
            required: true
        },
        totalRating: {
            type: String,
            required: true
        },
        averageRating: {
            type: String,
            required: true
        }
    },
    driverRating: {
        totalReviews: {
            type: String,
            required: true
        },
        totalRating: {
            type: String,
            required: true
        },
        averageRating: {
            type: String,
            required: true
        }
    },
    tripsAsDriverIDs: [
        {
            type: String
        }
    ],
    tripsAsPassengerIDs: [
        { 
            type: String
        }
    ],
    credits: {
        type: String,
        required: true
    },
    __v: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);

export default User;