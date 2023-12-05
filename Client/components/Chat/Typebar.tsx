import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import * as icons from '@expo/vector-icons';
import moment from 'moment';
import io from 'socket.io-client';
import { useAuth } from '../../utils/auth';
import { postMessage } from '../../utils/apiService';

const Typebar = ({ chat }) => {
  const { user, token } = useAuth();
  const textInputRef = useRef(null);
  const [text, setText] = useState('');
  const socket = io('http://localhost:3000');
  const receiver = chat.driver.userId === user.userId ? chat.passenger.userId : chat.driver.userId;


  const handleSend = async () => {
    const message = {
      userId: user?.userId,
      message: {
        content: text,
        time: moment().format('HH:mm')
      }
    }
    
    socket.emit('conversation', chat.chatId)
    socket.emit('message', message, receiver);
    await postMessage(chat.chatId, message, token);    

    if (text.trim() !== '') {
      setText('');
    }
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 300,
          maxHeight: 50,
          paddingLeft: 20,
          paddingVertical: 15,
          backgroundColor: '#fff',
          borderRadius: 50,
        }}>
        <TextInput
          ref={(ref) => (textInputRef.current = ref)}
          editable
          multiline
          placeholder="Type something..."
          onChangeText={(text) => setText(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <icons.FontAwesome name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Typebar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#efefef',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 50,
    padding: 15,
  },
});
