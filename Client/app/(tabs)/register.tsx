import { Alert, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import * as icons from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler'
import { Text, View } from '../../components/Themed'
import { Link } from 'expo-router';


type Props = {}

const register = (props: Props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [errName, setErrName] = useState('');
    const [errEmail, setErrEmail] = useState('');
    const [errNumber, setErrNumber] = useState('');
    const [errPassword, setErrPassword] = useState('');


    const handleSubmit = () => {
        setErrName(name.trim() === '' ? 'Please enter name' : '');
        setErrEmail(!validateEmail(email) ? 'Please enter valid email address' : '');
        setErrPassword(
            password.trim() === '' ? 'Please enter a password' : password !== confirmPassword ? 'Passwords do not match! Please re-enter' : ''
        );
        setErrNumber(number.trim() === '' ? 'Please enter mobile number' : '');
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleRegister = () => {
        if (errName === '' && errEmail === '' && errNumber === '' && errPassword === '') {

        }

    }

    return (
        <View style={styles.container}>
            <icons.AntDesign name="user" size={50} color="black" />
            <TextInput placeholder='Name'
                value={name}
                onChangeText={(text) => { setName(text) }}
                style={[styles.input, errName != '' && styles.errorInput]}
            ></TextInput>
            {errName ? <Text style={styles.errorText}>{errName}</Text> : null}

            <TextInput placeholder='E-mail'
                value={email}
                keyboardType='email-address'
                onChangeText={(text) => { setEmail(text) }}
                style={[styles.input, errEmail != '' && styles.errorInput]}
            ></TextInput>
            {errEmail ? <Text style={styles.errorText}>{errEmail}</Text> : null}

            <TextInput placeholder='Mobile Number (++)'
                value={number}
                keyboardType='phone-pad'
                onChangeText={(text) => { setNumber(text) }}
                style={[styles.input, errNumber != '' && styles.errorInput]}
            ></TextInput>
            {errNumber ? <Text style={styles.errorText}>{errNumber}</Text> : null}

            <TextInput placeholder='Password'
                value={password}
                onChangeText={(text) => {
                    setErrPassword('');
                    setPassword(text)
                }}
                style={styles.input}
                secureTextEntry={true}
            ></TextInput>

            <TextInput placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrPassword(text === password ? '' : 'Passwords do not match');
                }}
                style={styles.input}
                secureTextEntry={true}
            ></TextInput>
            {errPassword ? <Text style={styles.errorText}>{errPassword}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} >
                <Text>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity >
                <Link href={'/(tabs)/login'}>already have an account?</Link>
            </TouchableOpacity>

        </View>
    )
}

export default register

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