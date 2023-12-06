import React from 'react';
import { render } from '@testing-library/react-native';
import RatingStars from '../components/RatingStars';

describe('RatingStars component', () => {
    it('renders the correct number of stars based on the rating', () => {
        const { getAllByTestId } = render(<RatingStars rating={3.5} />);

        // Find all star icons in the rendered component
        const starIcons = getAllByTestId('star-icon');

        // Ensure the correct number of stars are rendered
        expect(starIcons).toHaveLength(5);

    });

    it('displays the rating text', () => {
        const { getByText } = render(<RatingStars rating={3.5} />);

        // Find the rating text in the rendered component
        const ratingText = getByText('3.5/5');

        // Ensure the rating text is displayed
        expect(ratingText).toBeDefined();
    });
});
