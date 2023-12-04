"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const userUtils_1 = require("../utils/userUtils");
const Chat_1 = __importDefault(require("../models/Chat"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
//Creating a new chat
const postChat = async (req, res) => {
    try {
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId)
            return res.status(401).json({ error: validatedUser });
        const { driverId, passengerId } = req.body;
        const chat = await Chat_1.default.insertMany({
            chatId: (0, uuid_1.v4)(),
            participantIDs: [driverId, passengerId]
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
const getAllChats = async (req, res) => {
    try {
        return res.status(200).send('ok');
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId)
            return res.status(401).json({ error: validatedUser });
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
        const validatedUser = await (0, userUtils_1.validateUser)(req);
        if (!validatedUser || !validatedUser.userId)
            return res.status(401).json({ error: validatedUser });
        const { chatId } = req.params;
        const { content, time } = req.body;
        const newMessage = {
            userId: validatedUser.userId,
            message: {
                content: content,
                time: time
            }
        };
        const message = await Chat_1.default.findOneAndUpdate({ chatId }, { $push: { chat: newMessage } }, { new: true });
        return res.status(201).json({ message });
    }
    catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    }
    ;
};
exports.default = {
    postChat,
    getAllChats,
    getChat,
    postMessage
};
