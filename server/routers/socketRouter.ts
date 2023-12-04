import { Server, Socket } from 'socket.io';

const socketRouter = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('conversation', (chatId: string) => {
            socket.join(chatId);
            
            socket.on('message', (content: any, receiverId: string) => {
                console.log(content);
                // io.emit('message', content);
                socket.in(chatId).to(receiverId).emit('message', content, receiverId);
                console.log(`Send to ${receiverId} in ${chatId}`);
                
            });
            
            socket.on('disconnect', () => {
                socket.leave(chatId);
            })
        });
    });
};

export default socketRouter;