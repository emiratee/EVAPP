"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        content: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    }
});
const chatSchema = new mongoose_1.default.Schema({
    participantIDs: [],
    chat: [messageSchema]
});
const Chat = mongoose_1.default.model('Chat', chatSchema);
exports.default = Chat;
