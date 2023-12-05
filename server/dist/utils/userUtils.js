"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = exports.tokenToUserId = exports.validateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
async function validateUser(req) {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            return Promise.resolve(false);
        const userId = tokenToUserId(authorization);
        if (!userId)
            return Promise.resolve(false);
        const user = await User_1.default.findOne({ userId });
        if (!user)
            return Promise.resolve(false);
        return Promise.resolve({ userId, user });
    }
    catch (error) {
        throw error;
    }
}
exports.validateUser = validateUser;
function tokenToUserId(token) {
    const SECRET_KEY = process.env.SECRET_KEY;
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        return decodedToken.userId;
    }
    catch (error) {
        return undefined;
    }
}
exports.tokenToUserId = tokenToUserId;
async function sendPushNotification(expoPushToken, title, body) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { someData: 'goes here' },
    };
    const expoApiUrl = 'https://exp.host/--/api/v2/push/send';
    const expoApiKey = 'zqG3VJYo1XKmtOUJu8AztuvzH4UxumvignYMqQde'; // Replace with your Expo API key
    try {
        const response = await fetch(expoApiUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                'Host': 'exp.host',
                'Accept-Language': 'en',
                'X-Expo-Api-Version': '2.0.0',
                'X-Expo-Client': 'UNIVERSE/22 CFNetwork/1209 Darwin/20.2.0',
                'X-Expo-Platform': 'ios',
                'Expo-Api-Key': expoApiKey,
            },
            body: JSON.stringify(message),
        });
        const responseData = await response.json();
        console.log('Push notification sent:', responseData);
    }
    catch (error) {
        console.error('Error sending push notification:', error);
    }
}
exports.sendPushNotification = sendPushNotification;
