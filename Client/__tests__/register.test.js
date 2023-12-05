import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { postRegister } from '../utils/apiService';

import Register from '../app/(tabs)/register';


jest.mock('../utils/auth', () => ({
    useAuth: () => ({
        login: jest.fn(),
        isAuthenticated: false, // Modify this to match your useAuth implementation
    }),
}));

jest.mock('expo-notifications', () => ({
    setNotificationChannelAsync: jest.fn(),
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));
jest.mock('../utils/apiService', () => ({
    postRegister: jest.fn(() => Promise.resolve({ token: 'dummyToken' })),
    cloudinaryUpload: jest.fn(() => Promise.resolve('dummyImageUrl')),
}));

describe('Register Page', () => {

    it('renders correctly', () => {
        const tree = renderer.create(<Register />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles text input changes', () => {
        const { getByPlaceholderText } = render(<Register />);
        const nameInput = getByPlaceholderText('Name');
        const emailInput = getByPlaceholderText('E-mail');
        const numberInput = getByPlaceholderText('Mobile Number (++)');
        const passwordInput = getByPlaceholderText('Password');
        const confirmPasswordInput = getByPlaceholderText('Confirm Password');

        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'johndasdoe@example.com');
        fireEvent.changeText(numberInput, '1234567890');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(confirmPasswordInput, 'password123');

        expect(nameInput.props.value).toBe('John Doe');
        expect(emailInput.props.value).toBe('johndasdoe@example.com');
        expect(numberInput.props.value).toBe('1234567890');
        expect(passwordInput.props.value).toBe('password123');
        expect(confirmPasswordInput.props.value).toBe('password123');
    });

    it('displays an error when no fields are filled', () => {
        const { getByText } = render(<Register />);

    // Find the "Register" button by text content
    const registerButton = getByText('Register');

    // Simulate a press on the "Register" button
    fireEvent.press(registerButton);

    // Find the error message elements
    const nameErrorMessage = getByText('Please enter name');
    const emailErrorMessage = getByText('Please enter correct email address');
    const numberErrorMessage = getByText('Please enter mobile number');
    const passwordErrorMessage = getByText('Please enter a password');

    // Expect the error messages to be displayed
    expect(nameErrorMessage).toBeDefined();
    expect(emailErrorMessage).toBeDefined();
    expect(numberErrorMessage).toBeDefined();
    expect(passwordErrorMessage).toBeDefined();
    });

    it('registers a user successfully', async () => {
        const { getByPlaceholderText, getByText, findByText } = render(<Register />);
    
        // Find input fields by placeholder text
        const nameInput = getByPlaceholderText('Name');
        const emailInput = getByPlaceholderText('E-mail');
        const numberInput = getByPlaceholderText('Mobile Number (++)');
        const passwordInput = getByPlaceholderText('Password');
        const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    
        // Find the "Register" button by text content
        const registerButton = getByText('Register');
    
        // Fill in the input fields
        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'johndsoe@example.com');
        fireEvent.changeText(numberInput, '1234567890');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(confirmPasswordInput, 'password123');
    
        // Simulate a press on the "Register" button
        fireEvent.press(registerButton);
    
        expect(postRegister).toHaveBeenCalledTimes(1); // Ensure postRegister was called once
      });
});