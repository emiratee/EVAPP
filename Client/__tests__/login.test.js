import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../app/(tabs)/login';
import { postLogin } from '../utils/apiService';



// Mock useAuth
jest.mock('../utils/auth', () => ({
    useAuth: () => ({
        login: jest.fn(),
        isAuthenticated: false, // Modify this to match your useAuth implementation
    }),
}));

// Mock postLogin
jest.mock('../utils/apiService', () => ({
    postLogin: jest.fn(() => ({ token: 'mockToken' })), // Modify this mock response as needed
}));

describe('Login Page', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Login />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles form submission with valid data', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('E-mail');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Login');

        // Simulate user input
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password');

        // Mock the postLogin function
        // postLogin.mockResolvedValueOnce({ token: 'mockToken' }); // Use a mock response

        // Simulate button click
        fireEvent.press(loginButton);

        // Assert that postLogin function is called with correct arguments
        expect(postLogin).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('displays error messages for empty inputs', async () => {
        const { getByText } = render(<Login />);
        const loginButton = getByText('Login');

        // Simulate button click with empty inputs
        fireEvent.press(loginButton);

        // Assert that error messages are displayed
        expect(getByText('Please enter e-mail')).toBeTruthy();
        expect(getByText('Please enter password')).toBeTruthy();
    });

});
