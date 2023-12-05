import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Chat/Navbar';
import ChatBody from '../../components/Chat/ChatBody';
import Typebar from '../../components/Chat/Typebar';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client';
import { useAuth } from '../../utils/auth';
import moment from 'moment';

const chatView = () => {
  const { chat } = useRoute().params;
  console.log(chat);
  
  const { user } = useAuth()
  const [messages, setMessages] = useState<any>(chat.chat);
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('conversation', chat.chatId);
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [
        ...prev,
        { userId: msg.userId, message: { content: msg.message.content, time: msg.message.time } },
      ]);
    });
  }, [])



  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <ChatBody messages={messages} />
      <Typebar setMessages={setMessages} chat={chat} />
    </View>
  )
}

export default chatView;