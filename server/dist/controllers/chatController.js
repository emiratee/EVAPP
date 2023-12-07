"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const userUtils_1 = require("../utils/userUtils");
const Chat_1 = __importDefault(require("../models/Chat"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const getUserById = async (id) => {
    try {
        return await User_1.default.findOne({ userId: id });
    }
    catch (error) {
        console.error(error);
    }
};
exports.getUserById = getUserById;
//Creating a new chat
const postChat = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId)
            return res.status(401).json({ error: validatedUser });
        const { driverId, passengerId } = req.body;
        const chatExists = await Chat_1.default.find({
            $or: [
                {
                    $and: [
                        { 'driver.userId': validatedUser.userId },
                        { 'passenger.userId': driverId }
                    ]
                },
                {
                    $and: [
                        { 'driver.userId': driverId },
                        { 'passenger.userId': validatedUser.userId }
                    ]
                }
            ]
        });
        if (chatExists && chatExists.length > 0)
            return res.status(200).send({ chat: chatExists[0] });
        const driver = await (0, exports.getUserById)(driverId);
        const passenger = await (0, exports.getUserById)(passengerId);
        const chat = await Chat_1.default.insertMany({
            chatId: (0, uuid_1.v4)(),
            'driver.userId': driver.userId,
            'driver.name': driver.name,
            'driver.imageUrl': driver.imageUrl,
            'driver.deletedChat': false,
            'passenger.userId': passenger.userId,
            'passenger.name': passenger.name,
            'passenger.imageUrl': passenger.imageUrl,
            'passenger.deletedChat': false,
        });
        if (!chat)
            return res.status(400).json({ error: "Could not post chat" });
        return res.status(201).json({ chat: chat[0] });
    }
    catch (error) {
        console.error("Error in postChat:", error);
        return res.status(500).json({ error: "Internal server error in postChat" });
    }
};
//Get all chats for message tab
// const getAllChats = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const validatedUser = await validateUser(req);
//         if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });
//         const chats = await Chat.find({ $or: [ { 'driver.userId': validatedUser.userId }, { 'passenger.userId': validatedUser.userId } ] });
//         return res.status(200).json({ chats });
//     } catch (error) {
//         console.error("Error in getAllChats:", error);
//         return res.status(500).json({ error: "Internal server error in getAllChats" });
//     }
// };
const getAllChats = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId)
            return res.status(401).json({ error: validatedUser });
        const chats = await Chat_1.default.find({
            $or: [
                { 'driver.userId': validatedUser.userId, 'driver.deletedChat': false },
                { 'passenger.userId': validatedUser.userId, 'passenger.deletedChat': false }
            ]
        });
        return res.status(200).json({ chats });
    }
    catch (error) {
        console.error("Error in getAllChats:", error);
        return res.status(500).json({ error: "Internal server error in getAllChats" });
    }
};
//Get individual chat
const getChat = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser)
            return res.status(401).json({ error: validatedUser });
        const { chatId } = req.params;
        const chat = await Chat_1.default.findOne({ chatId });
        return res.status(200).json({ chat });
    }
    catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    }
    ;
};
const postMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;
        const newMessage = await Chat_1.default.updateOne({ chatId }, {
            $set: { 'driver.deletedChat': false, 'passenger.deletedChat': false },
            $push: { chat: message }
        }, { new: true });
        return res.status(201).json({ message: newMessage });
    }
    catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    }
    ;
};
// putUpdate covers only the Chat deletion for now
const putUpdate = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser)
            return res.status(401).json({ error: validatedUser });
        const { chatId } = req.params;
        const { userId } = req.body;
        // check if the userId === the same userId from chat
        const updatedChat = await Chat_1.default.findOneAndUpdate({
            chatId,
            $or: [
                { 'driver.userId': userId },
                { 'passenger.userId': userId }
            ]
        }, {}, { new: true } // Return the modified document
        );
        // Ensure updatedChat is defined before using it
        if (!updatedChat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        // Use a separate variable for the $set block
        const updatedValues = {
            'driver.deletedChat': userId === updatedChat.driver?.userId,
            'passenger.deletedChat': userId === updatedChat.passenger?.userId
        };
        const finalChat = await Chat_1.default.findOneAndUpdate({ chatId }, { $set: updatedValues }, { new: true } // Return the modified document
        );
        console.log(finalChat);
        return res.status(200).json({ message: 'OK' });
    }
    catch (error) {
        console.error("Error in putUpdate:", error);
        return res.status(500).json({ error: "Internal server error in putUpdate" });
    }
};
exports.default = {
    postChat,
    getAllChats,
    getChat,
    postMessage,
    putUpdate
};
