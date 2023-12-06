import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChangePasswordForm from '../components/ChangePasswordForm';

describe('ChangePasswordForm component', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<ChangePasswordForm setVisible={() => { }} />);

        expect(getByPlaceholderText('Current Password')).toBeTruthy();
        expect(getByPlaceholderText('New Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByText('Update new password')).toBeTruthy();
    });

    it('displays an error message when submitting without filling in all fields', () => {
        const { getByText } = render(<ChangePasswordForm setVisible={() => { }} />);
        const updateButton = getByText('Update new password');

        fireEvent.press(updateButton);

        expect(getByText('Please fill in all fields.')).toBeTruthy();
    });

    it('displays an error message when new password and confirm password do not match', () => {
        const { getByText, getByPlaceholderText } = render(<ChangePasswordForm setVisible={() => { }} />);
        const currentPasswordInput = getByPlaceholderText('Current Password');
        const newPasswordInput = getByPlaceholderText('New Password');
        const confirmPasswordInput = getByPlaceholderText('Confirm Password');
        const updateButton = getByText('Update new password');

        fireEvent.changeText(currentPasswordInput, '123');
        fireEvent.changeText(newPasswordInput, 'newPassword123');
        fireEvent.changeText(confirmPasswordInput, 'differentPassword123');
        fireEvent.press(updateButton);

        expect(getByText('New password and confirm password must match.')).toBeTruthy();
    });

    // Add more test cases as needed to cover different scenarios
});
