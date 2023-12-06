import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import LocationSearch from '../components/LocationSearch'; // Import your LocationSearch component here
jest.useFakeTimers();

// Your test case

const onPressMock = jest.fn();

describe('LocationSearch component', () => {

    it('it should interact with GooglePlacesAutocomplete component', () => {
        const { queryByPlaceholderText } = render(<LocationSearch onPress={onPressMock} />);

        const autocompleteComponent = queryByPlaceholderText('Search');

        // Now, you can interact with or make assertions on the autocompleteComponent
        // For example, you can check if the component exists
        expect(autocompleteComponent).toBeTruthy();


    });
    it('it should simulate typing into the autocomplete input', () => {
        const { queryByPlaceholderText, queryByDisplayValue } = render(<LocationSearch onPress={onPressMock} />);
        const autocompleteComponent = queryByPlaceholderText('Search');

        fireEvent.changeText(autocompleteComponent, 'New York');
        // Check if the component state or behavior changes accordingly
        const typedText = queryByDisplayValue('New York');
        expect(typedText).toBeTruthy();

    });

});