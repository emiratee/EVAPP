"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketRouter = (io) => {
    io.on('connection', (socket) => {
        socket.on('conversation', (chatId) => {
            socket.join(chatId);
            socket.on('message', (content, receiverId) => {
                console.log(content);
                // io.emit('message', content);
                socket.to(chatId).to(receiverId).emit('message', content);
            });
            socket.on('disconnect', () => {
                socket.leave(chatId);
            });
        });
    });
};
exports.default = socketRouter;
