import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddTrip from '../app/(tabs)/addTrip'; // Adjust the import path as needed
import mockUserRich from '../__mocks__/mockUserRich';

// Mock dependencies and environment variables if necessary
// jest.mock('@env', () => ({ GOOGLE_MAPS_API_KEY: 'your-api-key' }));
jest.mock('@rneui/themed', () => ({ Overlay: 'Overlay' }));

jest.mock('../utils/auth', () => ({
    useAuth: jest.fn(() => ({
        token: 'your-mock-token',
        user: mockUserRich,
    })),
}));

jest.mock('../utils/apiService', () => ({
    addNewTrip: jest.fn(),
}));


jest.mock('react-native-google-places-autocomplete', () => ({
    GooglePlacesAutocomplete: jest.fn(),
}
));


jest.mock('react-native-paper', () => ({
    ...jest.requireActual('react-native-paper'),
    Snackbar: ({ visible, onDismiss }) => {
        return visible ? <div data-testid="snackbar">Snackbar content</div> : null;
    },
}));



describe('AddTrip component', () => {
    it('renders the component correctly', () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(<AddTrip />);

        // Assert that relevant UI elements are rendered
        expect(getByText('From:')).toBeDefined();
        expect(getByText('To:')).toBeDefined();
        expect(getByText('Smoking')).toBeDefined();
        expect(getByText('Child Seat')).toBeDefined();
        expect(getByText('Pets')).toBeDefined();
        expect(getByText('Alcohol')).toBeDefined();
        expect(getByText('Luggage')).toBeDefined();
        expect(getByText('Additional Comments:')).toBeDefined();
        expect(getByText('Create a trip')).toBeDefined();
        expect(getByText('Price per seat')).toBeDefined();
        expect(getByPlaceholderText('Enter price per seat')).toBeDefined();
    });

      

    // Add more test cases as needed
});
