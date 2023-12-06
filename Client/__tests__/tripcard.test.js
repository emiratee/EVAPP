import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TripCard from '../components/TripCard/TripCard';

const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));
import mockTrip from '../__mocks__/mockTrip'
import mockUserRich from '../__mocks__/mockUserRich'
jest.useFakeTimers();

describe('TripCard component', () => {
    const mockResponse = {
        trips: [
            {
                trip: mockTrip,
                driver: mockUserRich,
            },
            // Add more trips as needed for your test
        ],
    };

    it('renders TripCardItem components with response data', () => {
        const { getAllByTestId } = render(<TripCard response={mockResponse} />);

        // Assert that TripCardItem components are rendered for each trip in the response
        const tripCardItems = getAllByTestId('trip-card-item');
        expect(tripCardItems).toHaveLength(mockResponse.trips.length);

        // Add more assertions as needed based on your component's rendering logic
    });

    it('calls navigate when a card is pressed', () => {
        const { getAllByTestId } = render(<TripCard response={mockResponse} />);

        // Simulate a press on a card
        const tripCardItems = getAllByTestId('trip-card-item');
        const cardToPress = tripCardItems[0];
        fireEvent.press(cardToPress);

        // Assert that the navigate function is called with the expected parameters
        expect(mockNavigate).toHaveBeenCalledWith('TripInfo', {
            trip: mockResponse.trips[0].trip,
            driver: mockResponse.trips[0].driver,
        });

        // Add more assertions as needed based on your component's behavior
    });
});
