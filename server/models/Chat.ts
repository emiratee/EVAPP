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
    driver: {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        deletedChat: {
            type: Boolean,
            required: true
        }
    },
    passenger: {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        deletedChat: {
            type: Boolean,
            required: true
        }
    },
    chat: [{
        type: messageSchema
    }]
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
