"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketRouter = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            // Broadcast the message to everyone
            io.emit('chat message', msg);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
exports.default = socketRouter;
