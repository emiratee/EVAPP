import { Server, Socket } from 'socket.io';

const socketRouter = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        socket.on('chat message', (msg: string) => {
            console.log('message: ' + msg);
            // Broadcast the message to everyone
            io.emit('chat message', msg);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default socketRouter;
