import { StyleSheet, ScrollView, ImageBackground } from 'react-native'
import React from 'react'
import ChatMessage from './ChatMessage'


const ChatBody = ({ messages }) => {
  return (
      <ScrollView style={{backgroundColor:'#fbfafc', height: '100%', zIndex: -1 }}>
        {messages.map((message, index) => (
          <ChatMessage key={index} text={message.text} time={message.time} />
        ))}
      </ScrollView>
  )
}

export default ChatBody

const styles = StyleSheet.create({
  backgroundImage: {
    flex: -1,
    resizeMode: 'contain', // or 'contain' based on your preference
    justifyContent: 'center',
  },
});