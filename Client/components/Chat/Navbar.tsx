import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuth } from '../../utils/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
 

const Navbar = () => {
  const { user } = useAuth();
  
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      
        <TouchableOpacity onPress={() => navigate('messages') }>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <TouchableOpacity>
          <View>
            <Image source={{uri: user.imageUrl}} style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#000' }}/>
          </View>
        </TouchableOpacity>
      
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
  container: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    paddingVertical: 10,
    backgroundColor:'#efefef',
  
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 30,
  },
})