import jwt from 'jsonwebtoken';
import path from 'path'
import dotenv from "dotenv";
import User from '../models/User';
import { Request } from 'express';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });


//todo, change not to any
export async function validateUser(req: Request | any): Promise<any> {
    try {
        const { authorization } = req.headers

        if (!authorization) return Promise.resolve(false);

        const userId = tokenToUserId(authorization);
        if (!userId) return Promise.resolve(false);

        const user = await User.findOne({ userId });

        if (!user) return Promise.resolve(false);

        return Promise.resolve({ userId, user });
    } catch (error) {
        throw error;
    }
}


export function tokenToUserId(token: string) {
    const SECRET_KEY = process.env.SECRET_KEY!;
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY) as { userId: string };
        return decodedToken.userId;
    } catch (error) {
        return undefined;
    }
}

export async function sendPushNotification(expoPushToken: string, title: string, body: string) {
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
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}
