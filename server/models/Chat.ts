import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
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

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    participantIDs: [{
        type: String
    }],
    chat: [{
        type: messageSchema
    }]
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
