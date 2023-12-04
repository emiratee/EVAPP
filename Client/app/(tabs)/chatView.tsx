import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Navbar from '../../components/Chat/Navbar';
import ChatBody from '../../components/Chat/ChatBody';
import Typebar from '../../components/Chat/Typebar';
import moment from 'moment';
import io from 'socket.io-client';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../utils/auth';

const chatView = () => {
  const { chat } = useRoute().params;
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    const message = {
      userId: user?.userId,
      message: {
        content: inputText,
        time: getCurrentTime()
      }
    }
    const socket = io('http://localhost:3000');
    socket.emit('conversation', chat.chatId);
    socket.emit('message', message, '11e4ee24-dfed-4981-8da3-b22095691777');

    socket.on('message', (msg) => {
      console.log(msg);
      
    })
    if (inputText.trim() !== '') {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputText, time: getCurrentTime() },
      ]);
      setInputText('');
    }
  };

  const getCurrentTime = () => {
    return moment().format('HH:mm');
  };

  return (
    <View style={{flex: 1}}>
      <Navbar/>
      <ChatBody messages={messages}/>
      <Typebar onChangeText={setInputText} onSend={handleSend} />
    </View>
  )
}

export default chatView

const styles = StyleSheet.create({
  
})