import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ChatMessage from './ChatMessage'


const ChatBody = () => {
  return (
    <View style={{backgroundColor:'#000', height: '100%', zIndex: -1 }}>
      <Text>ChatBody</Text>
      <ChatMessage/>
    </View>
  )
}

export default ChatBody

const styles = StyleSheet.create({})