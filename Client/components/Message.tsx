import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox, Icon } from '@rneui/themed';

type Props = {}

const Message = () => {
  const [checkMessage, setcheckMessage] = useState(false);

  // const toggleCheckboxes = () => {
  //   setShowCheckboxes(!showCheckboxes);
  // };


  return (
    <View style={[styles.message, {justifyContent: 'space-between'}]}>
      <View style={styles.message}>
          {/* Here we will use the imageUrl of the driver or user -> {user.imageUrl} */}
          <View style={styles.image}>
              <Text style={{height: 20, width: 20, textAlign: 'center'}}>M</Text>
          </View>
          <View>
              {/* Here we will use the name of the driver or user -> {user.name} */}
              <Text>Manolo García</Text> 
              <Text>Hey, I'm waiting for you in...</Text>
          </View>
      </View>

      <View>
          <CheckBox
              center
              checkedIcon={
                  <Icon
                  name='radio-button-checked'
                  type='material'
                  color='#8757f7'
                  size={28}
                  // iconStyle={{}}
                  />
              }
              uncheckedIcon={
                  <Icon
                  name='radio-button-unchecked'
                  type='material'
                  color='grey'
                  size={28}
                  // iconStyle={{}}
                  />
              }
              checked={checkMessage}
              onPress={() => setcheckMessage(!checkMessage)}
          />
      </View>
      
    </View>
  )
}

export default Message;

const styles = StyleSheet.create({
  message: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 15,
  },
  image: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 20,
  },

});

// HARCODING EXAMPLES
/* <TouchableOpacity style={styles.container}>
                        <View style={styles.message}>
                            <View style={styles.image}>
                                <Text style={{height: 20, width: 20, textAlign: 'center'}}>B</Text>
                            </View>
                            <View>
                                <Text>Britney Spears</Text> 
                                <Text>It's Britney b*tch💕 </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.container}>
                        <View style={styles.message}>
                            <View style={styles.image}>
                                <Text style={{height: 20, width: 20, textAlign: 'center'}}>C</Text>
                            </View>
                            <View>
                                <Text>Chuck Norris</Text> 
                                <Text>Hi Magdalena, do you need help with...</Text>
                            </View>
                        </View>
                    </TouchableOpacity> */