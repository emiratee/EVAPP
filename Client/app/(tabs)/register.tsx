import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, Text, View, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as icons from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler'
import { Link } from 'expo-router';
import { useAuth } from '../../utils/auth';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { postRegister, cloudinaryUpload } from '../../utils/apiService';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as types from '../../types/types'
type Props = {}

const register = (props: Props) => {
    const { token, login, isAuthenticated } = useAuth();
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const scrollViewRef = useRef<ScrollView>(null);

    useFocusEffect(
        React.useCallback(() => {
            //reset states when the screen comes in focus again. 

            setName('')
            setEmail('')
            setNumber('')
            setPassword('')
            setConfirmPassword('')
            setImage('')
            setErrName('')
            setErrEmail('')
            setErrNumber('')
            setErrPassword('')
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        }, [])
    );

    const navigation = useNavigation();
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (isAuthenticated) {
                navigation.navigate('index');
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
            formData.append('file', {
                uri: resizedImage.uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });
            formData.append('upload_preset', 'profile_image')

            const imageUrl = await cloudinaryUpload(formData)
            setImageUrl(imageUrl);
            setIsLoading(false)


        }
        setIsLoading(false)
    };

    const resizeImage = async (uri: string, width: number) => {
        const resizedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width } }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        return resizedImage;
    };


    const handleSubmit = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrName(name.trim() === '' ? 'Please enter name' : '');
        setErrPassword(
            password.trim() === '' || confirmPassword.trim() === '' ? 'Please enter a password' : password !== confirmPassword ? 'Passwords do not match! Please re-enter' : ''
        );
        setErrNumber(number.trim() === '' ? 'Please enter mobile number' : '');

        if (emailRegex.test(email)) {
            setErrEmail('');
            (!errName.length && !errNumber.length && !errPassword.length) && (confirmPassword.trim() !== '') && registering()
        } else {
            setErrEmail('Please enter correct email address');
        }
    }

    const registering = () => {
        if (!errName.length && !errNumber.length && !errPassword.length) {
            const data = { name, email, phoneNumber: number, password, imageUrl, expoPushToken }
            postRegister(data).then(data => {
                login(data.token)
            }).catch(error => {
                alert(error)
            })
        }
    }

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

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
                        placeholderTextColor="#838383"

                    ></TextInput>
                </View>
                {errName ? <Text style={styles.errorText}>{errName}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput placeholder='E-mail'
                        value={email}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onChangeText={(text) => { setEmail(text) }}
                        style={[styles.input, errEmail != '' && styles.errorInput]}
                        placeholderTextColor="#838383"

                    ></TextInput>

                </View>
                {errEmail ? <Text style={styles.errorText}>{errEmail}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Mobile Number (++)'
                        value={number}
                        keyboardType='phone-pad'
                        onChangeText={(text) => { setNumber(text) }}
                        style={[styles.input, errNumber != '' && styles.errorInput]}
                        placeholderTextColor="#838383"

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
                        placeholderTextColor="#838383"

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
                        placeholderTextColor="#838383"

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
        </TouchableWithoutFeedback>
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


async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'e742dc1b-029a-4980-8364-e2d0e7b1f40e' })).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}