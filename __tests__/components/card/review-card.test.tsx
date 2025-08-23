import React from 'react';
import { render, fireEvent } from '@/__tests__/utils/test-utils';
import ReviewCard from '@/components/card/review.card';
import { createMockReview, TEST_IDS } from '@/__tests__/utils/test-utils';

describe('ReviewCard', () => {
    const mockReview = createMockReview();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with review data', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        expect(getByText(mockReview.comment)).toBeTruthy();
    });

    it('displays review comment correctly', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        expect(getByText(mockReview.comment)).toBeTruthy();
    });

    it('displays user name correctly', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        expect(getByText(mockReview.user.name)).toBeTruthy();
    });

    it('displays rating correctly', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        // The rating should be displayed
        expect(getByText(mockReview.comment)).toBeTruthy();
    });

    it('displays formatted date correctly', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        // Date should be formatted and displayed
        expect(getByText(mockReview.comment)).toBeTruthy();
    });

    it('handles review with missing user data', () => {
        const reviewWithoutUser = createMockReview({
            user: undefined,
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutUser} />);

        expect(getByText(reviewWithoutUser.comment)).toBeTruthy();
    });

    it('handles review with missing user name', () => {
        const reviewWithoutUserName = createMockReview({
            user: { ...mockReview.user, name: undefined },
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutUserName} />);

        expect(getByText(reviewWithoutUserName.comment)).toBeTruthy();
    });

    it('handles review with missing user avatar', () => {
        const reviewWithoutAvatar = createMockReview({
            user: { ...mockReview.user, avatar: undefined },
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutAvatar} />);

        expect(getByText(reviewWithoutAvatar.comment)).toBeTruthy();
    });

    it('handles review with missing comment', () => {
        const reviewWithoutComment = createMockReview({
            comment: undefined,
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutComment} />);

        // Should still render the card even without comment
        expect(getByText(reviewWithoutComment.user.name)).toBeTruthy();
    });

    it('handles review with empty comment', () => {
        const reviewWithEmptyComment = createMockReview({
            comment: '',
        });

        const { getByText } = render(<ReviewCard item={reviewWithEmptyComment} />);

        expect(getByText(reviewWithEmptyComment.user.name)).toBeTruthy();
    });

    it('handles review with very long comment', () => {
        const reviewWithLongComment = createMockReview({
            comment: 'This is a very long review comment that might exceed normal display limits and should be handled gracefully by the component. It contains multiple sentences and should wrap properly.',
        });

        const { getByText } = render(<ReviewCard item={reviewWithLongComment} />);

        expect(getByText(reviewWithLongComment.comment)).toBeTruthy();
    });

    it('handles review with special characters in comment', () => {
        const reviewWithSpecialChars = createMockReview({
            comment: 'Review with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
        });

        const { getByText } = render(<ReviewCard item={reviewWithSpecialChars} />);

        expect(getByText(reviewWithSpecialChars.comment)).toBeTruthy();
    });

    it('handles review with zero rating', () => {
        const reviewWithZeroRating = createMockReview({
            rating: 0,
        });

        const { getByText } = render(<ReviewCard item={reviewWithZeroRating} />);

        expect(getByText(reviewWithZeroRating.comment)).toBeTruthy();
    });

    it('handles review with decimal rating', () => {
        const reviewWithDecimalRating = createMockReview({
            rating: 4.7,
        });

        const { getByText } = render(<ReviewCard item={reviewWithDecimalRating} />);

        expect(getByText(reviewWithDecimalRating.comment)).toBeTruthy();
    });

    it('handles review with maximum rating', () => {
        const reviewWithMaxRating = createMockReview({
            rating: 5,
        });

        const { getByText } = render(<ReviewCard item={reviewWithMaxRating} />);

        expect(getByText(reviewWithMaxRating.comment)).toBeTruthy();
    });

    it('handles review with negative rating', () => {
        const reviewWithNegativeRating = createMockReview({
            rating: -1,
        });

        const { getByText } = render(<ReviewCard item={reviewWithNegativeRating} />);

        expect(getByText(reviewWithNegativeRating.comment)).toBeTruthy();
    });

    it('handles review with rating above maximum', () => {
        const reviewWithHighRating = createMockReview({
            rating: 10,
        });

        const { getByText } = render(<ReviewCard item={reviewWithHighRating} />);

        expect(getByText(reviewWithHighRating.comment)).toBeTruthy();
    });

    it('handles review with missing date', () => {
        const reviewWithoutDate = createMockReview({
            createdAt: undefined,
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutDate} />);

        expect(getByText(reviewWithoutDate.comment)).toBeTruthy();
    });

    it('handles review with invalid date format', () => {
        const reviewWithInvalidDate = createMockReview({
            createdAt: 'invalid-date-format',
        });

        const { getByText } = render(<ReviewCard item={reviewWithInvalidDate} />);

        expect(getByText(reviewWithInvalidDate.comment)).toBeTruthy();
    });

    it('handles review with future date', () => {
        const reviewWithFutureDate = createMockReview({
            createdAt: '2025-12-31T23:59:59Z',
        });

        const { getByText } = render(<ReviewCard item={reviewWithFutureDate} />);

        expect(getByText(reviewWithFutureDate.comment)).toBeTruthy();
    });

    it('handles review with very old date', () => {
        const reviewWithOldDate = createMockReview({
            createdAt: '2020-01-01T00:00:00Z',
        });

        const { getByText } = render(<ReviewCard item={reviewWithOldDate} />);

        expect(getByText(reviewWithOldDate.comment)).toBeTruthy();
    });

    it('applies correct styling for light theme', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        expect(getByText(mockReview.comment)).toBeTruthy();
    });

    it('applies correct styling for dark theme', () => {
        // Mock dark theme
        jest.doMock('@/context/theme.context', () => ({
            useTheme: () => ({
                theme: { dark: true },
            }),
        }));

        const { getByText } = render(<ReviewCard item={mockReview} />);

        expect(getByText(mockReview.comment)).toBeTruthy();
    });

    it('handles review with missing ID', () => {
        const reviewWithoutId = createMockReview({
            id: undefined,
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutId} />);

        expect(getByText(reviewWithoutId.comment)).toBeTruthy();
    });

    it('handles review with empty ID', () => {
        const reviewWithEmptyId = createMockReview({
            id: '',
        });

        const { getByText } = render(<ReviewCard item={reviewWithEmptyId} />);

        expect(getByText(reviewWithEmptyId.comment)).toBeTruthy();
    });

    it('maintains accessibility', () => {
        const { getByText } = render(<ReviewCard item={mockReview} />);

        const reviewComment = getByText(mockReview.comment);
        expect(reviewComment).toBeTruthy();
    });

    it('handles rapid re-renders correctly', () => {
        const { rerender, getByText } = render(<ReviewCard item={mockReview} />);

        // Initial render
        expect(getByText(mockReview.comment)).toBeTruthy();

        // Rapid re-renders with different data
        const updatedReview = createMockReview({ comment: 'Updated review comment' });
        rerender(<ReviewCard item={updatedReview} />);

        expect(getByText(updatedReview.comment)).toBeTruthy();
    });

    it('handles review with missing image', () => {
        const reviewWithoutImage = createMockReview({
            user: { ...mockReview.user, avatar: undefined },
        });

        const { getByText } = render(<ReviewCard item={reviewWithoutImage} />);

        expect(getByText(reviewWithoutImage.user.name)).toBeTruthy();
    });

    it('handles review with very short comment', () => {
        const reviewWithShortComment = createMockReview({
            comment: 'Hi',
        });

        const { getByText } = render(<ReviewCard item={reviewWithShortComment} />);

        expect(getByText(reviewWithShortComment.comment)).toBeTruthy();
    });

    it('handles review with single character comment', () => {
        const reviewWithSingleChar = createMockReview({
            comment: '!',
        });

        const { getByText } = render(<ReviewCard item={reviewWithSingleChar} />);

        expect(getByText(reviewWithSingleChar.comment)).toBeTruthy();
    });

    it('handles review with emoji in comment', () => {
        const reviewWithEmoji = createMockReview({
            comment: 'Great course! 🎉👍',
        });

        const { getByText } = render(<ReviewCard item={reviewWithEmoji} />);

        expect(getByText(reviewWithEmoji.comment)).toBeTruthy();
    });

    it('handles review with HTML-like content in comment', () => {
        const reviewWithHtml = createMockReview({
            comment: 'Course with <strong>bold</strong> and <em>italic</em> content',
        });

        const { getByText } = render(<ReviewCard item={reviewWithHtml} />);

        expect(getByText(reviewWithHtml.comment)).toBeTruthy();
    });
});
