import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navbar from '../../components/Chat/Navbar'
import ChatBody from '../../components/Chat/ChatBody'
import Typebar from '../../components/Chat/Typebar'


const chatView = () => {
  return (
    <View style={{flex: 1}}>
      <Navbar />
      <ChatBody/>
      <Typebar/>
    </View>
  )
}

export default chatView

const styles = StyleSheet.create({})