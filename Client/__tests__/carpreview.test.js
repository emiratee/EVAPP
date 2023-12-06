import React from 'react';
import { render, fireEvent, getComputedStyle } from '@testing-library/react-native';
import CarPreview from '../components/CarPreview'; 
import * as types from '../types/types';
import renderer from 'react-test-renderer';

import { mockCar1 } from '../__mocks__/mockUserRich'

describe('CarPreview component', () => {
    it('renders correctly with unselected car', () => {
        const setSelectedCar = jest.fn();
        const selectedCar = null;

        const component = renderer.create(
            <CarPreview
                item={mockCar1}
                setSelectedCar={setSelectedCar}
                selectedCar={selectedCar}
                onPress={jest.fn()}
            />
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })
    it('renders correctly with selected car', () => {
        const setSelectedCar = jest.fn();
        const selectedCar = mockCar1;

        const component = renderer.create(
            <CarPreview
                item={mockCar1}
                setSelectedCar={setSelectedCar}
                selectedCar={selectedCar}
                onPress={jest.fn()}
            />
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('calls onPress when pressed', () => {
        const setSelectedCar = jest.fn();
        const selectedCar = null;
        const onPress = jest.fn();

        const { getByTestId } = render(
            <CarPreview
                item={mockCar1}
                setSelectedCar={setSelectedCar}
                selectedCar={selectedCar}
                onPress={onPress}
            />
        );

        // Simulate a press event
        fireEvent.press(getByTestId('car-preview-wrapper'));

        // Assert that the onPress function was called
        expect(onPress).toHaveBeenCalled();
    });
});
