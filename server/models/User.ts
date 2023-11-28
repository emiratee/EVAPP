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
    cars: [carSchema],
    passengerRating: {
        totalReviews: {
            type: Number,
            required: true
        },
        totalRating: {
            type: Number,
            required: true
        },
        averageRating: {
            type: Number,
            required: true
        }
    },
    driverRating: {
        totalReviews: {
            type: Number,
            required: true
        },
        totalRating: {
            type: Number,
            required: true
        },
        averageRating: {
            type: Number,
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
    // trips: {
    //     driver: [
    //         {
    //             type: String
    //         }
    //     ],
    //     passenger: [
    //         {
    //             type: String
    //         }
    //     ]
    // },
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