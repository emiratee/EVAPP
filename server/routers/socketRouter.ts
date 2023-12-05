import { Server, Socket } from 'socket.io';
import { getUserById } from '../controllers/chatController';
import { sendPushNotification } from '../utils/userUtils';

const socketRouter = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('conversation', (chatId: string) => {
            socket.join(chatId);

            socket.on('message', async (content: any, receiverId: string) => {
                socket.in(chatId).to(receiverId).emit('message', content);
                const senderUser = await getUserById(content.userId);
                const recieverUser = await getUserById(receiverId);
                console.log(senderUser.name);
                console.log(recieverUser.expoPushToken);
                console.log(recieverUser.expoPushToken && senderUser.name );
                
                recieverUser.expoPushToken && senderUser.name && await sendPushNotification(recieverUser.expoPushToken, senderUser.name, content.message.content);
                await sendPushNotification(recieverUser.expoPushToken, senderUser.name, content.message.content)
            });

            socket.on('disconnect', () => {
                socket.leave(chatId);
            })
        });
    });
};

export default socketRouter;