import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Bill from '../components/Bill'; 
import { useNavigation } from '@react-navigation/native';

// Mock the useNavigation hook

import mockUserRich from '../__mocks__/mockUserRich';
import mockTrip from '../__mocks__/mockTrip'
import mockTripExpensive from '../__mocks__/mockTripExpensive'
// Mock user data
jest.mock('../utils/auth', () => ({
    useAuth: jest.fn(() => ({
      user: mockUserRich,
    })),
  }));
describe('Bill component', () => {
    it('renders correctly with enough credits', () => {
        jest.mock('../utils/auth', () => ({
            useAuth: jest.fn(() => ({
              user: mockUserRich,
            })),
          }));
        const { getByText, queryByText } = render(
            <Bill
                trip={mockTrip} // Replace with your mock trip data
                price={100}
                seats={2}
                setIsPickerVisible={jest.fn()}
                hasEnoughCredits={true}
            />
        );

        // Assert that credits and total amount are displayed
        expect(getByText('Credits:')).toBeTruthy();
        expect(getByText('10000.00€')).toBeTruthy();
        expect(getByText('2x seats á 50.00€')).toBeTruthy();
        expect(getByText('Total Amount:')).toBeTruthy();
        expect(getByText('100.00€')).toBeTruthy();

        // Assert that the "Add more here." button is not displayed
        expect(queryByText("It seems you don't have enough credits.")).toBeNull();
    });

    it('renders correctly without enough credits', () => {
        // Mock the navigate function from useNavigation
        
        const mockNavigate = jest.fn();
        useNavigation.mockReturnValue({ navigate: mockNavigate });

        const { getByText } = render(
            <Bill
                trip={mockTripExpensive} // Replace with your mock trip data
                price={100000}
                seats={2}
                setIsPickerVisible={jest.fn()}
                hasEnoughCredits={false}
            />
        );

        // Assert that credits and total amount are displayed
        expect(getByText('Credits:')).toBeTruthy();
        expect(getByText('10000.00€')).toBeTruthy();
        expect(getByText('2x seats á 50000.00€')).toBeTruthy();
        expect(getByText('Total Amount:')).toBeTruthy();
        expect(getByText('100000.00€')).toBeTruthy();

        // Assert that the "Add more here." button is displayed
        expect(getByText("It seems you don't have enough credits.")).toBeTruthy();

        // Click the "Add more here." button and check if navigate function is called
        fireEvent.press(getByText("It seems you don't have enough credits."));
        expect(mockNavigate).toHaveBeenCalledWith('addCredits');
    });

    
});
