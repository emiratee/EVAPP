import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Navbar from '../../components/Chat/Navbar';
import ChatBody from '../../components/Chat/ChatBody';
import Typebar from '../../components/Chat/Typebar';
import moment from 'moment';

const chatView = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
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