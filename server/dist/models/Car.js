"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const carSchema = new mongoose_1.default.Schema({
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
exports.carSchema = carSchema;
const Car = mongoose_1.default.model('Car', carSchema);
exports.default = Car;
