import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddNewCar from '../components/AddNewCar';
import { Alert } from 'react-native'; 
import mockUserRich from '../__mocks__/mockUserRich'
// Mock any dependencies or functions used in your component
const mockSetAddCarSnackBar = jest.fn();
const mockSetAddNewCar = jest.fn();

jest.mock('../utils/apiService', () => ({
    addCar: jest.fn(() => Promise.resolve({ car: {} })),
}));

jest.mock('../utils/auth', () => ({
    useAuth: jest.fn(() => ({
        token: 'your-mock-token',
        setUser: jest.fn(),
        user: mockUserRich, // Mock user object
    })),
}));

describe('AddNewCar component', () => {
    it('should render the component correctly', () => {
        const { getByText } = render(<AddNewCar setAddCarSnackBar={mockSetAddCarSnackBar} setAddNewCar={mockSetAddNewCar} />);

        // Assert that the component renders
        expect(getByText('Add New Car')).toBeTruthy();
    });

    it('should add a car when the "Add a car" button is pressed', async () => {
        const { getByText, getByTestId } = render(<AddNewCar setAddCarSnackBar={mockSetAddCarSnackBar} setAddNewCar={mockSetAddNewCar} />);

        // Mock user input
        fireEvent.changeText(getByTestId('model-input'), 'Test Model');
        fireEvent.changeText(getByTestId('color-input'), 'Test Color');
        fireEvent.changeText(getByTestId('licence-plates-input'), 'Test License Plates');

        // Trigger button press
        fireEvent.press(getByText('Add a car'));

        // Wait for the API call to complete (use setTimeout for async operations)
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Assert that the addCar function was called with the correct data
        expect(require('../utils/apiService').addCar).toHaveBeenCalledWith(
            {
                model: 'Test Model',
                color: 'Test Color',
                licencePlate: 'Test License Plates',
                seats: 1,
            },
            'your-mock-token'
        );
    });
    it('should show an alert when there are no entered fields', () => {
        jest.spyOn(Alert, 'alert');

        const { getByText } = render(
            <AddNewCar setAddCarSnackBar={mockSetAddCarSnackBar} setAddNewCar={mockSetAddNewCar} />);

        // Trigger button press without entering any fields
        fireEvent.press(getByText('Add a car'));

        // Assert that the Alert.alert function was called with the expected arguments
        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing fields',
            'Please fill in all mandatory fields',
        );

        // Restore the original function to avoid interference with other tests
    });

});
