import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuth } from '../../utils/auth';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  return (
    <>
      {user?.userId === message.userId ? (
        <View style={styles.container}>
          <View style={styles.message}>
            <Text>{message.message.content}</Text>
            <Text style={styles.time}>{message.message.time}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.container, { justifyContent: 'flex-start' }]}>
          <View style={[styles.message, { borderBottomLeftRadius: 0, borderBottomRightRadius: 10, backgroundColor: '#9f81e3' }]}>
            <Text>{message.message.content}</Text>
            <Text style={[styles.time, { textAlign: 'left', paddingRight: 0, paddingLeft: 10 }]}>{message.message.time}</Text>
          </View>
        </View>
      )}
    </>)
}

export default ChatMessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
  },
  message: {
    borderRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#cabbed',
    padding: 10,
    width: '50%',
  },
  time: {
    textAlign: 'right',
    paddingTop: 5,
    paddingRight: 5,
  }
});