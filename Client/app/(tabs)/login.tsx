import { StyleSheet, TouchableOpacity, Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { Link, useFocusEffect, useNavigation } from 'expo-router'
import { postLogin } from '../../utils/apiService';
import { useAuth } from '../../utils/auth'
import * as icons from '@expo/vector-icons';

type Props = {}



const login= (props: Props) => {

    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errEmail, setErrEmail] = useState<string>('');
    const [errPassword, setErrPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            if (isAuthenticated) {
                navigation.navigate('index');
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
        !isAuthenticated && <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View
                style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='E-mail'
                        value={email}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onChangeText={(text) => { setEmail(text) }}
                        style={[styles.input, errEmail != '' && styles.errorInput]}
                        placeholderTextColor="#838383"
                    />
                </View>
                {errEmail ? <Text style={styles.errorText}>{errEmail}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='Password'
                        value={password}
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => { setPassword(text) }}
                        style={[styles.input, errEmail != '' && styles.errorInput]}
                        placeholderTextColor="#838383"

                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <icons.MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={20} color='black' style={{ padding: 10 }} />
                    </TouchableOpacity>
                </View>

                {errPassword ? <Text style={styles.errorText}>{errPassword}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleSubmit} >
                    <Text style={{ color: '#fff' }}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} >
                    <Link href={'/(tabs)/register'}>don't have an account yet?</Link>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default login

const styles = StyleSheet.create({
    container: {
        padding: 30,
        flex: 1,
        justifyContent: 'center',

    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#ededed',
        fontSize: 16,
        marginBottom: 15,
        zIndex: 1,
        height: 50,
        top: 8,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 5
    },

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#ededed',
        borderRadius: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
})