import { carSchema } from "./Car";
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        available: {
            type: String,
            required: true

        },
        onHold: {
            type: String,
            required: true
        }
    },
});

const User = mongoose.model('User', userSchema);

export default User;