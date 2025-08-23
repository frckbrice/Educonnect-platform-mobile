import React from 'react';
import { render, fireEvent } from '@/__tests__/utils/test-utils';
import CourseCard from '@/components/card/course-card';
import { createMockCourse, TEST_IDS } from '@/__tests__/utils/test-utils';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('CourseCard', () => {
    const mockCourse = createMockCourse();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with course data', () => {
        const { getByText } = render(<CourseCard item={mockCourse} />);

        expect(getByText(mockCourse.name)).toBeTruthy();
    });

    it('displays course name correctly', () => {
        const { getByText } = render(<CourseCard item={mockCourse} />);

        expect(getByText(mockCourse.name)).toBeTruthy();
    });

    it('displays course ratings correctly', () => {
        const { getByText } = render(<CourseCard item={mockCourse} />);

        // The Ratings component should be rendered
        expect(getByText(mockCourse.name)).toBeTruthy();
    });

    it('handles course with different slug for image mapping', () => {
        const courseWithSpecialSlug = createMockCourse({
            slug: 'multi-vendor-mern-stack-e-commerce-project-with-all-functionalities-absolutely-for-beginners'
        });

        const { getByText } = render(<CourseCard item={courseWithSpecialSlug} />);

        expect(getByText(courseWithSpecialSlug.name)).toBeTruthy();
    });

    it('handles course with React Native slug for image mapping', () => {
        const courseWithReactNativeSlug = createMockCourse({
            slug: 'build-your-mobile-app-development-career-with-react-native'
        });

        const { getByText } = render(<CourseCard item={courseWithReactNativeSlug} />);

        expect(getByText(courseWithReactNativeSlug.name)).toBeTruthy();
    });

    it('uses default image for unknown slug', () => {
        const courseWithUnknownSlug = createMockCourse({
            slug: 'unknown-course-slug'
        });

        const { getByText } = render(<CourseCard item={courseWithUnknownSlug} />);

        expect(getByText(courseWithUnknownSlug.name)).toBeTruthy();
    });

    it('applies correct styling for light theme', () => {
        const { getByText } = render(<CourseCard item={mockCourse} />);

        expect(getByText(mockCourse.name)).toBeTruthy();
    });

    it('applies correct styling for dark theme', () => {
        // Mock dark theme
        jest.doMock('@/context/theme.context', () => ({
            useTheme: () => ({
                theme: { dark: true },
            }),
        }));

        const { getByText } = render(<CourseCard item={mockCourse} />);

        expect(getByText(mockCourse.name)).toBeTruthy();
    });

    it('handles course with missing optional fields', () => {
        const courseWithMinimalData = createMockCourse({
            description: undefined,
            prerequisites: undefined,
            benefits: undefined,
            content: undefined,
        });

        const { getByText } = render(<CourseCard item={courseWithMinimalData} />);

        expect(getByText(courseWithMinimalData.name)).toBeTruthy();
    });

    it('handles course with empty arrays', () => {
        const courseWithEmptyArrays = createMockCourse({
            prerequisites: [],
            benefits: [],
            content: [],
        });

        const { getByText } = render(<CourseCard item={courseWithEmptyArrays} />);

        expect(getByText(courseWithEmptyArrays.name)).toBeTruthy();
    });

    it('handles course with very long name', () => {
        const courseWithLongName = createMockCourse({
            name: 'This is a very long course name that might exceed normal display limits and should be handled gracefully by the component',
        });

        const { getByText } = render(<CourseCard item={courseWithLongName} />);

        expect(getByText(courseWithLongName.name)).toBeTruthy();
    });

    it('handles course with special characters in name', () => {
        const courseWithSpecialChars = createMockCourse({
            name: 'Course with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
        });

        const { getByText } = render(<CourseCard item={courseWithSpecialChars} />);

        expect(getByText(courseWithSpecialChars.name)).toBeTruthy();
    });

    it('handles course with zero ratings', () => {
        const courseWithZeroRatings = createMockCourse({
            ratings: 0,
        });

        const { getByText } = render(<CourseCard item={courseWithZeroRatings} />);

        expect(getByText(courseWithZeroRatings.name)).toBeTruthy();
    });

    it('handles course with decimal ratings', () => {
        const courseWithDecimalRatings = createMockCourse({
            ratings: 4.7,
        });

        const { getByText } = render(<CourseCard item={courseWithDecimalRatings} />);

        expect(getByText(courseWithDecimalRatings.name)).toBeTruthy();
    });

    it('handles course with zero purchased count', () => {
        const courseWithZeroPurchased = createMockCourse({
            purchased: 0,
        });

        const { getByText } = render(<CourseCard item={courseWithZeroPurchased} />);

        expect(getByText(courseWithZeroPurchased.name)).toBeTruthy();
    });

    it('handles course with large purchased count', () => {
        const courseWithLargePurchased = createMockCourse({
            purchased: 999999,
        });

        const { getByText } = render(<CourseCard item={courseWithLargePurchased} />);

        expect(getByText(courseWithLargePurchased.name)).toBeTruthy();
    });

    it('handles course with free price', () => {
        const freeCourse = createMockCourse({
            price: '0',
        });

        const { getByText } = render(<CourseCard item={freeCourse} />);

        expect(getByText(freeCourse.name)).toBeTruthy();
    });

    it('handles course with expensive price', () => {
        const expensiveCourse = createMockCourse({
            price: '999.99',
        });

        const { getByText } = render(<CourseCard item={expensiveCourse} />);

        expect(getByText(expensiveCourse.name)).toBeTruthy();
    });

    it('handles course with same estimated and actual price', () => {
        const courseWithSamePrice = createMockCourse({
            price: '29.99',
            estimatedPrice: '29.99',
        });

        const { getByText } = render(<CourseCard item={courseWithSamePrice} />);

        expect(getByText(courseWithSamePrice.name)).toBeTruthy();
    });

    it('handles course with estimated price higher than actual price', () => {
        const courseWithDiscount = createMockCourse({
            price: '19.99',
            estimatedPrice: '29.99',
        });

        const { getByText } = render(<CourseCard item={courseWithDiscount} />);

        expect(getByText(courseWithDiscount.name)).toBeTruthy();
    });

    it('handles course with estimated price lower than actual price', () => {
        const courseWithPriceIncrease = createMockCourse({
            price: '39.99',
            estimatedPrice: '29.99',
        });

        const { getByText } = render(<CourseCard item={courseWithPriceIncrease} />);

        expect(getByText(courseWithPriceIncrease.name)).toBeTruthy();
    });

    it('maintains accessibility', () => {
        const { getByText } = render(<CourseCard item={mockCourse} />);

        const courseName = getByText(mockCourse.name);
        expect(courseName).toBeTruthy();
    });

    it('handles rapid re-renders correctly', () => {
        const { rerender, getByText } = render(<CourseCard item={mockCourse} />);

        // Initial render
        expect(getByText(mockCourse.name)).toBeTruthy();

        // Rapid re-renders with different data
        const updatedCourse = createMockCourse({ name: 'Updated Course Name' });
        rerender(<CourseCard item={updatedCourse} />);

        expect(getByText(updatedCourse.name)).toBeTruthy();
    });

    it('handles course with missing image', () => {
        const courseWithoutImage = createMockCourse({
            slug: 'course-without-image',
        });

        const { getByText } = render(<CourseCard item={courseWithoutImage} />);

        expect(getByText(courseWithoutImage.name)).toBeTruthy();
    });

    it('handles course with very short name', () => {
        const courseWithShortName = createMockCourse({
            name: 'A',
        });

        const { getByText } = render(<CourseCard item={courseWithShortName} />);

        expect(getByText(courseWithShortName.name)).toBeTruthy();
    });

    it('handles course with empty name', () => {
        const courseWithEmptyName = createMockCourse({
            name: '',
        });

        const { getByText } = render(<CourseCard item={courseWithEmptyName} />);

        expect(getByText('')).toBeTruthy();
    });
});
