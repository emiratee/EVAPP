import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React from 'react';
import * as icons from '@expo/vector-icons';



const Typebar = () => {

  const [value, onChangeText] = React.useState('');

  return (
    <View style={styles.container}>
      
        <View style={{width: 300, maxHeight: 50, paddingLeft: 20, paddingVertical: 15, backgroundColor: '#fff', borderRadius: 50,}}>
          <TextInput
          editable
          multiline
          placeholder='Type something...'
          onChangeText={text => onChangeText(text)}
          value={value}
          />
        </View>
        <TouchableOpacity style={styles.button}>
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
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingVertical: 10,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#efefef'
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 50,
    padding:15,
  }
})