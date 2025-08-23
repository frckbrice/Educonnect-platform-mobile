import React from 'react';
import { render } from '@/__tests__/utils/test-utils';
import Rating from '@/components/common/ratings';
import { TEST_IDS } from '@/__tests__/utils/test-utils';

describe('Rating', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<Rating rating={4} testID={TEST_IDS.RATING_STARS} />);

        expect(getByTestId(TEST_IDS.RATING_STARS)).toBeTruthy();
    });

    it('renders correct number of stars for maxRating', () => {
        const { getAllByText } = render(<Rating rating={3} maxRating={5} />);

        // Should render 5 stars total
        expect(getAllByText('★')).toHaveLength(5);
    });

    it('renders correct number of filled stars', () => {
        const { getAllByText } = render(<Rating rating={3} maxRating={5} />);

        // Should render 3 filled stars
        expect(getAllByText('★')).toHaveLength(3);
        // Should render 2 empty stars
        expect(getAllByText('☆')).toHaveLength(2);
    });

    it('renders half star for decimal ratings', () => {
        const { getAllByText } = render(<Rating rating={3.5} maxRating={5} />);

        // Should render 3 filled stars, 1 half star, 1 empty star
        expect(getAllByText('★')).toHaveLength(3);
        expect(getAllByText('⯨')).toHaveLength(1); // half star
        expect(getAllByText('☆')).toHaveLength(1);
    });

    it('clamps rating to maxRating', () => {
        const { getAllByText } = render(<Rating rating={7} maxRating={5} />);

        // Should clamp to 5 stars
        expect(getAllByText('★')).toHaveLength(5);
    });

    it('clamps rating to minimum 0', () => {
        const { getAllByText } = render(<Rating rating={-2} maxRating={5} />);

        // Should clamp to 0 stars
        expect(getAllByText('★')).toHaveLength(0);
        expect(getAllByText('☆')).toHaveLength(5);
    });

    it('applies custom size to stars', () => {
        const customSize = 24;
        const { getByTestId } = render(
            <Rating rating={4} size={customSize} testID={TEST_IDS.RATING_STARS} />
        );

        const ratingContainer = getByTestId(TEST_IDS.RATING_STARS);
        expect(ratingContainer).toBeTruthy();
    });

    it('applies custom color to stars', () => {
        const customColor = '#FF0000';
        const { getByTestId } = render(
            <Rating rating={4} color={customColor} testID={TEST_IDS.RATING_STARS} />
        );

        const ratingContainer = getByTestId(TEST_IDS.RATING_STARS);
        expect(ratingContainer).toBeTruthy();
    });

    it('applies custom styles', () => {
        const customStyle = { marginTop: 10 };
        const { getByTestId } = render(
            <Rating rating={4} style={customStyle} testID={TEST_IDS.RATING_STARS} />
        );

        const ratingContainer = getByTestId(TEST_IDS.RATING_STARS);
        expect(ratingContainer).toBeTruthy();
    });

    it('handles edge case of rating 0', () => {
        const { getAllByText } = render(<Rating rating={0} maxRating={5} />);

        // Should render 5 empty stars
        expect(getAllByText('★')).toHaveLength(0);
        expect(getAllByText('☆')).toHaveLength(5);
    });

    it('handles edge case of rating equal to maxRating', () => {
        const { getAllByText } = render(<Rating rating={5} maxRating={5} />);

        // Should render 5 filled stars
        expect(getAllByText('★')).toHaveLength(5);
        expect(getAllByText('☆')).toHaveLength(0);
    });

    it('handles decimal ratings correctly', () => {
        const { getAllByText } = render(<Rating rating={2.7} maxRating={5} />);

        // Should render 2 filled stars, 1 half star, 2 empty stars
        expect(getAllByText('★')).toHaveLength(2);
        expect(getAllByText('⯨')).toHaveLength(1);
        expect(getAllByText('☆')).toHaveLength(2);
    });

    it('handles very small decimal ratings', () => {
        const { getAllByText } = render(<Rating rating={0.1} maxRating={5} />);

        // Should render 0 filled stars, 1 half star, 4 empty stars
        expect(getAllByText('★')).toHaveLength(0);
        expect(getAllByText('⯨')).toHaveLength(1);
        expect(getAllByText('☆')).toHaveLength(4);
    });

    it('handles very large decimal ratings', () => {
        const { getAllByText } = render(<Rating rating={4.9} maxRating={5} />);

        // Should render 4 filled stars, 1 half star, 0 empty stars
        expect(getAllByText('★')).toHaveLength(4);
        expect(getAllByText('⯨')).toHaveLength(1);
        expect(getAllByText('☆')).toHaveLength(0);
    });

    it('renders with different maxRating values', () => {
        const { rerender, getAllByText } = render(<Rating rating={3} maxRating={3} />);

        // Should render 3 stars total
        expect(getAllByText('★')).toHaveLength(3);

        // Change maxRating
        rerender(<Rating rating={3} maxRating={10} />);

        // Should render 10 stars total
        expect(getAllByText('★')).toHaveLength(3);
        expect(getAllByText('☆')).toHaveLength(7);
    });

    it('maintains accessibility', () => {
        const { getByTestId } = render(
            <Rating rating={4} testID={TEST_IDS.RATING_STARS} />
        );

        const ratingContainer = getByTestId(TEST_IDS.RATING_STARS);
        expect(ratingContainer).toBeTruthy();
    });

    it('handles rapid re-renders correctly', () => {
        const { rerender, getAllByText } = render(<Rating rating={3} maxRating={5} />);

        // Initial render
        expect(getAllByText('★')).toHaveLength(3);

        // Rapid re-renders
        rerender(<Rating rating={4} maxRating={5} />);
        rerender(<Rating rating={2} maxRating={5} />);
        rerender(<Rating rating={5} maxRating={5} />);

        // Final state should be correct
        expect(getAllByText('★')).toHaveLength(5);
    });
});
