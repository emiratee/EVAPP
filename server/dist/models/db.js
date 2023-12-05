"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
async function db() {
    const URL = process.env.ATLAS_URL;
    if (!URL)
        throw new Error('ATLAS_URL is not defined in the environment variables.');
    await mongoose_1.default.connect(URL);
    console.log("Connected to db ✅ dev");
    return mongoose_1.default.connection;
}
exports.default = db;
