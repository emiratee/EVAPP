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
  const { user } = useAuth()
  const [messages, setMessages] = useState<any>([]);
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected as ${user?.userId} in ${chat.chatId}`);
      socket.emit('conversation', chat.chatId);
    });

    socket.on('message', (msg, receiver) => {
      //if (user?.userId === receiver) return;
      console.log('Received message');
      setMessages((prev) => [
        ...prev,
        { text: msg.message.content, time: msg.message.time },
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