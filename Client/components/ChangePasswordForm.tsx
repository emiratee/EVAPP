import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as icons from '@expo/vector-icons';
import { updateAccount } from '../utils/apiService';
import { useAuth } from '../utils/auth';
import { useNavigation } from 'expo-router';
type Props = {
    setVisible: (value: React.SetStateAction<boolean>) => void
}
const ChangePasswordForm = ({ setVisible }: Props) => {
    const { token } = useAuth();
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // individual state variables for password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleSubmit = async () => {
        setError('');

        // Validate input fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password must match.');
            return;
        }
        if (currentPassword === newPassword) return setError("Oopsie! You cannot set the new password to your current one")
        try {
            // Call the changePassword function from your authentication utility
            token && await updateAccount({ currentPassword, newPassword }, token);

            // Password changed successfully
            // Password changed successfully
            Alert.alert(
                'Success',
                'Password changed successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Close the overlay in the parent component
                            setVisible(false);

                            // Clear the form
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');

                            // Navigate back to the profile page
                            navigation.navigate('profile' as never);
                        },
                    },
                ]
            );
        } catch (error) {
            // Handle password change error (e.g., incorrect current password)
            setError('Failed to change password. Please check your current password.');
        }

    };

    const toggleShowPassword = (passwordType: string) => {
        switch (passwordType) {
            case 'current':
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Change Password</Text>
            <Text style={styles.errorText}>{error}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={(text) => setCurrentPassword(text)}
                    onFocus={() => setShowCurrentPassword(false)}
                    placeholderTextColor="#838383"

                />
                <TouchableOpacity onPress={() => toggleShowPassword('current')}>
                    <icons.MaterialCommunityIcons name={showCurrentPassword ? 'eye' : 'eye-off'} size={20} color='black' style={{ padding: 10 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                    onFocus={() => setShowNewPassword(false)}
                    placeholderTextColor="#838383"

                />
                <TouchableOpacity onPress={() => toggleShowPassword('new')}>
                    <icons.MaterialCommunityIcons name={showNewPassword ? 'eye' : 'eye-off'} size={20} color='black' style={{ padding: 10 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    onFocus={() => setShowConfirmPassword(false)}
                    placeholderTextColor="#838383"

                />
                <TouchableOpacity onPress={() => toggleShowPassword('confirm')}>
                    <icons.MaterialCommunityIcons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color='black' style={{ padding: 10 }} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Update new password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 300,
        justifyContent: 'center',
        padding: 10,
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    errorText: {
        color: '#d91921',
        marginBottom: 10,
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
});

export default ChangePasswordForm;
