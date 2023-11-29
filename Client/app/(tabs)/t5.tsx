import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFocusEffect, useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { TouchableOpacity } from 'react-native';

type Props = {}

const t5 = (props: Props) => {
  const { isAuthenticated, logout } = useAuth();
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        navigation.navigate('login');
      }
    }, [isAuthenticated])
  );

  const handleSubmit = ()=>{
    logout();
  }

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default t5

const styles = StyleSheet.create({

  button: {
    backgroundColor: '#000',
    borderRadius: 25,
    marginHorizontal: 60,
    marginVertical: 20,
    padding: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',
  },

})