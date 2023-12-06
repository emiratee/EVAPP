import React from 'react';
import { render } from '@testing-library/react-native';
import TripCardItem from '../components/TripCard/TripCardItem/TripCardItem'; // Adjust the import path as needed
import mockTrip from '../__mocks__/mockTrip'
import mockUserRich from '../__mocks__/mockUserRich'

jest.useFakeTimers();


describe('TripCardItem component', () => {

    it('renders the component correctly', () => {
        const { getByText } = render(<TripCardItem trip={mockTrip} driver={mockUserRich} />);

        // Assert that relevant UI elements are rendered
        expect(getByText(mockTrip.departure.city)).toBeDefined();
        expect(getByText(mockTrip.destination.city)).toBeDefined();
        expect(getByText(`${parseFloat(mockTrip.price).toFixed(2)}€`)).toBeDefined();
        expect(getByText(`${mockTrip.seats.available}/${mockTrip.seats.total}`)).toBeDefined();
        expect(getByText(mockUserRich.name)).toBeDefined();
        expect(getByText(`${mockUserRich.driverRating.averageRating}`)).toBeDefined();
    });
    
    it('renders default icon when driver.imageUrl is not provided', () => {
        // Render the component with a mockTrip and driver without imageUrl
        const driverWithoutImageUrl = { ...mockUserRich, imageUrl: null };
        const { getByTestId } = render(<TripCardItem trip={mockTrip} driver={driverWithoutImageUrl} />);

        // Get the default icon element by test ID
        const defaultIcon = getByTestId('default-icon');

        // Assert that the default icon element is present
        expect(defaultIcon).toBeDefined();
    });
    // Add more test cases as needed
});
