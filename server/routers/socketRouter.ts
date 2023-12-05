import { Server, Socket } from 'socket.io';
import { getUserById } from '../controllers/chatController';
import { sendPushNotification } from '../utils/userUtils';

const socketRouter = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('conversation', (chatId: string) => {
            socket.join(chatId);
            
            socket.on('message', async (content: any, receiverId: string) => {
                socket.in(chatId).to(receiverId).emit('message', content);
                const receiverUser = await getUserById(receiverId);
                receiverUser.expoPushToken && await sendPushNotification(receiverUser.expoPushToken, 'New message', 'Test');
            });
            
            socket.on('disconnect', () => {
                socket.leave(chatId);
            })
        });
    });
};

export default socketRouter;