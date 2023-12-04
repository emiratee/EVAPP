import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
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
});

export { carSchema };

const Car = mongoose.model('Car', carSchema);

export default Car;