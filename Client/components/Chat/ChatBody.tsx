import { ScrollView } from 'react-native'
import React from 'react'
import ChatMessage from './ChatMessage'

const ChatBody = ({ messages }) => {
  return (
      <ScrollView style={{backgroundColor:'#fbfafc', height: '100%', zIndex: -1 }}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </ScrollView>
  )
}

export default ChatBody;