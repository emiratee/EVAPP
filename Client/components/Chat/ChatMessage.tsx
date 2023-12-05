import { StyleSheet, Text, View } from 'react-native';
import React from 'react';



const ChatMessage = () => {
  return (
    <View>
      <Text style={{color: '#fff', textAlign: 'center', fontSize: 52}}>ChatMessage</Text>
      <View style={styles.container}>
        <Text>Hallihallo! wo bist du? Ich warte auf dich in Stresemannstr. 123C</Text>
        <Text>time</Text>
      </View>
    </View>
  )
}

export default ChatMessage;

/*
COLOR SCHEMA
radius buttons: #8757f7
input- background: #8757f7
output- background: #cabbed

*/
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: '#cabbed',
    padding: 10,
    width: '50%',
    marginLeft: 8
  },
  

});