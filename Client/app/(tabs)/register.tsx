import { Alert, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as icons from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler'
import { Text, View } from '../../components/Themed'
import { Link } from 'expo-router';
import { useAuth } from '../../utils/auth';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { postRegister, uploadImage } from '../../utils/apiService';
import * as ImageManipulator from 'expo-image-manipulator';

type Props = {}

const register = (props: Props) => {
    const { token, login, isAuthenticated } = useAuth();

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (isAuthenticated) {
                navigation.navigate('search');
            }
        }, [isAuthenticated])
    );

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [errName, setErrName] = useState('');
    const [errEmail, setErrEmail] = useState('');
    const [errNumber, setErrNumber] = useState('');
    const [errPassword, setErrPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const pickImage = async () => {
        setIsLoading(true)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri)

            const resizedImage = await resizeImage(result.assets[0].uri, 1400);

            const uriParts = result.assets[0].uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            formData.append('image', {
                uri: resizedImage.uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });

            const response = await uploadImage(formData)
            setImageUrl(response.imageUrl);
            setIsLoading(false)


        }
        setIsLoading(false)
    };

    const resizeImage = async (uri, width) => {
        const resizedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width } }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        return resizedImage;
    };

    const handleSubmit = () => {

        setErrName(name.trim() === '' ? 'Please enter name' : '');
        setErrEmail(!validateEmail(email) ? 'Please enter valid email address' : '');
        setErrPassword(
            password.trim() === '' ? 'Please enter a password' : password !== confirmPassword ? 'Passwords do not match! Please re-enter' : ''
        );

        setErrNumber(number.trim() === '' ? 'Please enter mobile number' : '')


        if (!errName && !errEmail && !errNumber && !errPassword) {
            const data = { name, email, phoneNumber: number, password, imageUrl }
            postRegister(data).then(data => {
                login(data.token)
            })
        }

    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.picture} onPress={pickImage} >
                <View style={styles.picture}>
                    {
                        isLoading ? <ActivityIndicator size={'large'} /> :
                            image ? <Image source={{ uri: image }} style={styles.picture} /> :
                                <icons.AntDesign name="user" size={50} color="black" style={{ alignSelf: 'center' }} />

                    }
                </View>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <TextInput placeholder='Name'
                    value={name}
                    onChangeText={(text) => { setName(text) }}
                    style={[styles.input, errName != '' && styles.errorInput]}
                ></TextInput>
            </View>
            {errName ? <Text style={styles.errorText}>{errName}</Text> : null}
            <View style={styles.inputContainer}>
                <TextInput placeholder='E-mail'
                    value={email}
                    keyboardType='email-address'
                    onChangeText={(text) => { setEmail(text.toLowerCase()) }}
                    style={[styles.input, errEmail != '' && styles.errorInput]}
                ></TextInput>

            </View>
            {errEmail ? <Text style={styles.errorText}>{errEmail}</Text> : null}
            <View style={styles.inputContainer}>
                <TextInput placeholder='Mobile Number (++)'
                    value={number}
                    keyboardType='phone-pad'
                    onChangeText={(text) => { setNumber(text) }}
                    style={[styles.input, errNumber != '' && styles.errorInput]}
                ></TextInput>

            </View>
            {errNumber ? <Text style={styles.errorText}>{errNumber}</Text> : null}
            <View style={styles.inputContainer}>

                <TextInput placeholder='Password'
                    value={password}
                    onChangeText={(text) => {
                        setErrPassword('');
                        setPassword(text)
                    }}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    textContentType="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <icons.MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={20} color='black' style={{ padding: 10 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput placeholder='Confirm Password'
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setErrPassword(text === password ? '' : 'Passwords do not match');
                    }}
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    textContentType="password"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <icons.MaterialCommunityIcons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color='black' style={{ padding: 10 }} />
                </TouchableOpacity>
            </View>
            {errPassword ? <Text style={styles.errorText}>{errPassword}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                <Text style={{ color: '#fff' }} >Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} >
                <Link href={'/(tabs)/login'}>already have an account?</Link>
            </TouchableOpacity>

        </View>
    )
}

export default register

const styles = StyleSheet.create({
    container: {
        padding: 30,
        flex: 1
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
    button: {
        backgroundColor: '#000',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 5
    },
    picture: {
        height: 120,
        width: 120,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 80,
        marginVertical: 10,
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
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
})