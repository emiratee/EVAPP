import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import * as icons from '@expo/vector-icons';



const Typebar = ({ onChangeText, onSend }) => {
  const textInputRef = useRef(null);

  const handleSend = () => {
    onSend();
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  return (
    <View style={styles.container}>
      
        <View style={{width: 300, maxHeight: 50, paddingLeft: 20, paddingVertical: 15, backgroundColor: '#fff', borderRadius: 50,}}>
          <TextInput
          ref={ref => (textInputRef.current = ref)}
          editable
          multiline
          placeholder='Type something...'
          onChangeText={text => onChangeText(text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <icons.FontAwesome name='send' size={20} color='white' />
        </TouchableOpacity>
      
    </View>
  )
}

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
    padding:15,
  }
})