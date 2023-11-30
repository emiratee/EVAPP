import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../utils/auth';
import * as icons from '@expo/vector-icons';

const ChangePasswordForm = () => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // individual state variables for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    try {
      // Call the changePassword function from your authentication utility
      await changePassword(currentPassword, newPassword);

      // Password changed successfully, you can navigate to a success screen or perform other actions
      console.log('Password changed successfully!');
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
      <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Change Password</Text>
      <Text style={styles.errorText}>{error}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={!showCurrentPassword}
          value={currentPassword}
          onChangeText={(text) => setCurrentPassword(text)}
          onFocus={() => setShowCurrentPassword(false)}
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
