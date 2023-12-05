"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatController_1 = require("../controllers/chatController");
const userUtils_1 = require("../utils/userUtils");
const socketRouter = (io) => {
    io.on('connection', (socket) => {
        socket.on('conversation', (chatId) => {
            socket.join(chatId);
            socket.on('message', async (content, receiverId) => {
                socket.in(chatId).to(receiverId).emit('message', content);
                const senderUser = await (0, chatController_1.getUserById)(content.userId);
                const recieverUser = await (0, chatController_1.getUserById)(receiverId);
                console.log(senderUser.name);
                console.log(recieverUser.expoPushToken);
                console.log(recieverUser.expoPushToken && senderUser.name);
                recieverUser.expoPushToken && senderUser.name && await (0, userUtils_1.sendPushNotification)(recieverUser.expoPushToken, senderUser.name, content.message.content);
                await (0, userUtils_1.sendPushNotification)(recieverUser.expoPushToken, senderUser.name, content.message.content);
            });
            socket.on('disconnect', () => {
                socket.leave(chatId);
            });
        });
    });
};
exports.default = socketRouter;
