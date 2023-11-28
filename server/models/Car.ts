import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    licencePlate: {
        type: String,
        required: true
    },
    __v: {
        type: String
    }
});

export { carSchema };