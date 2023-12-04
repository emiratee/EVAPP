import { Request, Response } from 'express';
import dotenv from "dotenv";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateUser } from '../utils/userUtils';
import Chat from '../models/Chat';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

//Creating a new chat
const postChat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });

        const { driverId, passengerId } = req.body;

        const chat = await Chat.insertMany({
            chatId: uuidv4(),
            participantIDs: [driverId, passengerId]
        });
        if (!chat) return res.status(400).json({ error: "Could not post chat" });

        return res.status(201).json({ chat: chat[0] })
    } catch (error) {
        console.error("Error in postChat:", error);
        return res.status(500).json({ error: "Internal server error in postChat" });
    }
}

//Get all chats for message tab
const getAllChats = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).send('ok')
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });

    } catch (error) {
        console.error("Error in getAllChats:", error);
        return res.status(500).json({ error: "Internal server error in getAllChats" });
    }
};


//Get individual chat
const getChat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser) return res.status(401).json({ error: validatedUser });

        const { chatId } = req.params;
        const chat = await Chat.findOne({ chatId });

        return res.status(200).json({ chat });
    } catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    };
};

const postMessage = async (req: Request, res: Response) => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });

        const { chatId } = req.params;
        const { content, time } = req.body;

        const newMessage = {
            userId: validatedUser.userId,
            message: {
                content: content,
                time: time
            }
        };

        const message = await Chat.findOneAndUpdate(
            { chatId },
            { $push: { chat: newMessage } },
            { new: true }
        );

        return res.status(201).json({ message });
    } catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    };
};

export default {
    postChat,
    getAllChats,
    getChat,
    postMessage
}