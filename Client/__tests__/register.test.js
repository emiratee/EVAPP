import React from 'react';
import { StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import Register from '../app/(tabs)/register';
import { postLogin } from '../utils/apiService';

jest.mock('../utils/auth', () => ({
    useAuth: () => ({
        login: jest.fn(),
        isAuthenticated: false, // Modify this to match your useAuth implementation
    }),
}));
// jest.mock('expo-font');
// jest.mock('expo-asset');
jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
}));




jest.mock('@expo/vector-icons', () => ({}));

jest.mock('expo-image-picker', () => ({}));
jest.mock('expo-image-manipulator', () => ({}));
jest.mock('expo-device', () => ({}));
jest.mock('expo-notifications', () => ({}));

describe('Register Page', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Register />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    // it('handles form submission with valid data', async () => {
    //     const { getByPlaceholderText, getByText } = render(<Login />);
    //     const emailInput = getByPlaceholderText('E-mail');
    //     const passwordInput = getByPlaceholderText('Password');
    //     const loginButton = getByText('Login');

    //     // Simulate user input
    //     fireEvent.changeText(emailInput, 'test@example.com');
    //     fireEvent.changeText(passwordInput, 'password');

    //     // Mock the postLogin function
    //     // postLogin.mockResolvedValueOnce({ token: 'mockToken' }); // Use a mock response

    //     // Simulate button click
    //     fireEvent.press(loginButton);

    //     // Assert that postLogin function is called with correct arguments
    //     expect(postLogin).toHaveBeenCalledWith('test@example.com', 'password');
    // });

    // it('displays error messages for empty inputs', async () => {
    //     const { getByText } = render(<Login />);
    //     const loginButton = getByText('Login');

    //     // Simulate button click with empty inputs
    //     fireEvent.press(loginButton);

    //     // Assert that error messages are displayed
    //     expect(getByText('Please enter e-mail')).toBeTruthy();
    //     expect(getByText('Please enter password')).toBeTruthy();
    // });

});
