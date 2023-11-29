import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text, View } from '../../components/Themed'
import { TextInput } from 'react-native-gesture-handler'
import { Link, useFocusEffect, useNavigation } from 'expo-router'
import { postLogin } from '../../utils/apiService';
import { useAuth } from '../../utils/auth'

type Props = {}

const login = (props: Props) => {

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');

  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        navigation.navigate('search');
      }
    }, [isAuthenticated])
  );

  const handleSubmit = async () => {
    setErrEmail(email.trim() === '' ? 'Please enter e-mail' : '');
    setErrPassword(password.trim() === '' ? 'Please enter password' : '');


    if (!errPassword && !errEmail) {

      const response = await postLogin(email.trim(), password.trim());

      if (response.token) {
        login(response.token)
      } else {
        alert(response.error);
        setEmail('')
        setPassword('');
      }
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder='E-mail'
        value={email}
        keyboardType='email-address'
        onChangeText={(text) => { setEmail(text) }}
        style={[styles.input, errEmail != '' && styles.errorInput]}
      ></TextInput>
      {errEmail ? <Text style={styles.errorText}>{errEmail}</Text> : null}

      <TextInput placeholder='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => { setPassword(text) }}
        style={[styles.input, errEmail != '' && styles.errorInput]}
      ></TextInput>
      {errPassword ? <Text style={styles.errorText}>{errPassword}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} >
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity >
        <Link href={'/(tabs)/register'}>don't have an account yet!</Link>
      </TouchableOpacity>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  input: {
    height: 50,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'black',
    borderRadius: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 5
  },
})