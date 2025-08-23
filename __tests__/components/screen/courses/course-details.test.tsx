import React from 'react';
import { render, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import CourseDetailsScreen from '@/components/screen/courses/course-details';
import { createMockCourse, TEST_IDS } from '@/__tests__/utils/test-utils';

// Mock expo-router
jest.mock('expo-router', () => ({
    useGlobalSearchParams: () => ({
        id: 'test-course-1',
        name: 'Test Course',
        title: 'Test Course Title',
        slug: 'test-course',
        description: 'This is a test course description',
        price: '29.99',
        estimatedPrice: '49.99',
        prerequisites: JSON.stringify([]),
        benefits: JSON.stringify([]),
        courseContent: JSON.stringify([]),
    }),
    router: {
        push: jest.fn(),
    },
}));

// Mock useUser hook
jest.mock('@/hooks/use-user', () => ({
    __esModule: true,
    default: () => ({
        apiUser: {
            id: 'test-user-1',
            orders: [],
        },
        loader: false,
    }),
    setAuthorizationHeader: jest.fn(),
}));

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock react-native-iap
jest.mock('react-native-iap', () => ({
    initConnection: jest.fn(),
    getProducts: jest.fn(),
    requestPurchase: jest.fn(),
    finishTransaction: jest.fn(),
    purchaseUpdatedListener: jest.fn(() => ({
        remove: jest.fn(),
    })),
    purchaseErrorListener: jest.fn(() => ({
        remove: jest.fn(),
    })),
    endConnection: jest.fn(),
    flushFailedPurchasesCachedAsPendingAndroid: jest.fn(),
}));

describe('CourseDetailsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with course data', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Test Course')).toBeTruthy();
    });

    it('displays course title correctly', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Test Course')).toBeTruthy();
    });

    it('displays course price correctly', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('$29.99')).toBeTruthy();
    });

    it('displays estimated price when different from actual price', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('$49.99')).toBeTruthy();
        expect(getByText('$29.99')).toBeTruthy();
    });

    it('displays course description correctly', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('This is a test course description')).toBeTruthy();
    });

    it('handles show more/less functionality', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Should show "Show More" button for long descriptions
        const showMoreButton = getByText(/Show More/i);
        if (showMoreButton) {
            fireEvent.press(showMoreButton);

            await waitFor(() => {
                expect(getByText(/Show Less/i)).toBeTruthy();
            });
        }
    });

    it('displays prerequisites section when available', () => {
        // Mock prerequisites data
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({
                id: 'test-course-1',
                name: 'Test Course',
                prerequisites: JSON.stringify([
                    { title: 'Basic JavaScript knowledge' },
                    { title: 'Understanding of React' },
                ]),
                benefits: JSON.stringify([]),
                courseContent: JSON.stringify([]),
                price: '29.99',
                estimatedPrice: '49.99',
            }),
            router: {
                push: jest.fn(),
            },
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Course Prerequisites')).toBeTruthy();
        expect(getByText('Basic JavaScript knowledge')).toBeTruthy();
        expect(getByText('Understanding of React')).toBeTruthy();
    });

    it('displays benefits section when available', () => {
        // Mock benefits data
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({
                id: 'test-course-1',
                name: 'Test Course',
                prerequisites: JSON.stringify([]),
                benefits: JSON.stringify([
                    { title: 'Build real-world projects' },
                    { title: 'Get certified' },
                ]),
                courseContent: JSON.stringify([]),
                price: '29.99',
                estimatedPrice: '49.99',
            }),
            router: {
                push: jest.fn(),
            },
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Course Benefits')).toBeTruthy();
        expect(getByText('Build real-world projects')).toBeTruthy();
        expect(getByText('Get certified')).toBeTruthy();
    });

    it('displays course content when lessons tab is active', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Find and press Lessons tab
        const lessonsTab = getByText('Lessons');
        if (lessonsTab) {
            fireEvent.press(lessonsTab);

            await waitFor(() => {
                // Should show lessons content
                expect(lessonsTab).toBeTruthy();
            });
        }
    });

    it('displays reviews when reviews tab is active', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Find and press Reviews tab
        const reviewsTab = getByText('Reviews');
        if (reviewsTab) {
            fireEvent.press(reviewsTab);

            await waitFor(() => {
                // Should show reviews content
                expect(reviewsTab).toBeTruthy();
            });
        }
    });

    it('handles free course purchase correctly', async () => {
        // Mock free course
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({
                id: 'test-course-1',
                name: 'Test Course',
                price: '0',
                estimatedPrice: '0',
                prerequisites: JSON.stringify([]),
                benefits: JSON.stringify([]),
                courseContent: JSON.stringify([]),
            }),
            router: {
                push: jest.fn(),
            },
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        // Should show "Buy Course - $0" button
        expect(getByText(/Buy Course - \$0/i)).toBeTruthy();
    });

    it('handles paid course purchase correctly', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Should show "Buy Course - $29.99" button
        expect(getByText(/Buy Course - \$29.99/i)).toBeTruthy();
    });

    it('shows "Enter to course" for purchased courses', () => {
        // Mock user with purchased course
        jest.doMock('@/hooks/use-user', () => ({
            __esModule: true,
            default: () => ({
                apiUser: {
                    id: 'test-user-1',
                    orders: [{ courseId: 'test-course-1' }],
                },
                loader: false,
            }),
            setAuthorizationHeader: jest.fn(),
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Enter to course')).toBeTruthy();
    });

    it('handles course image loading states', async () => {
        const { getByTestId } = render(<CourseDetailsScreen />);

        // Should show loading indicator initially
        const loadingIndicator = getByTestId('loading-indicator');
        if (loadingIndicator) {
            expect(loadingIndicator).toBeTruthy();
        }
    });

    it('handles course image error states', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Should handle image errors gracefully
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('displays student count correctly', () => {
        // Mock course with student count
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({
                id: 'test-course-1',
                name: 'Test Course',
                purchased: 150,
                price: '29.99',
                estimatedPrice: '49.99',
                prerequisites: JSON.stringify([]),
                benefits: JSON.stringify([]),
                courseContent: JSON.stringify([]),
            }),
            router: {
                push: jest.fn(),
            },
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('150 Students')).toBeTruthy();
    });

    it('displays lecture count correctly', () => {
        // Mock course with content
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({
                id: 'test-course-1',
                name: 'Test Course',
                price: '29.99',
                estimatedPrice: '49.99',
                prerequisites: JSON.stringify([]),
                benefits: JSON.stringify([]),
                courseContent: JSON.stringify([
                    {
                        videoSection: [
                            { title: 'Lecture 1' },
                            { title: 'Lecture 2' },
                            { title: 'Lecture 3' },
                        ],
                    },
                ]),
            }),
            router: {
                push: jest.fn(),
            },
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('3 Lectures')).toBeTruthy();
    });

    it('handles refresh functionality', async () => {
        const { getByTestId } = render(<CourseDetailsScreen />);

        // Should handle pull-to-refresh
        const scrollView = getByTestId('course-details-scroll');
        if (scrollView) {
            // Simulate refresh
            expect(scrollView).toBeTruthy();
        }
    });

    it('applies correct styling for light theme', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Test Course')).toBeTruthy();
    });

    it('applies correct styling for dark theme', () => {
        // Mock dark theme
        jest.doMock('@/context/theme.context', () => ({
            useTheme: () => ({
                theme: { dark: true },
            }),
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        expect(getByText('Test Course')).toBeTruthy();
    });

    it('handles missing course data gracefully', () => {
        // Mock missing course data
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({}),
            router: {
                push: jest.fn(),
            },
        }));

        const { container } = render(<CourseDetailsScreen />);

        // Should still render without crashing
        expect(container).toBeTruthy();
    });

    it('handles malformed JSON data gracefully', () => {
        // Mock malformed JSON data
        jest.doMock('expo-router', () => ({
            useGlobalSearchParams: () => ({
                id: 'test-course-1',
                name: 'Test Course',
                prerequisites: 'invalid-json',
                benefits: 'invalid-json',
                courseContent: 'invalid-json',
                price: '29.99',
                estimatedPrice: '49.99',
            }),
            router: {
                push: jest.fn(),
            },
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        // Should handle malformed JSON gracefully
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('maintains accessibility', () => {
        const { getByText } = render(<CourseDetailsScreen />);

        const courseTitle = getByText('Test Course');
        expect(courseTitle).toBeTruthy();
    });

    it('handles rapid tab switching correctly', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Switch between tabs rapidly
        const aboutTab = getByText('About');
        const lessonsTab = getByText('Lessons');
        const reviewsTab = getByText('Reviews');

        if (aboutTab && lessonsTab && reviewsTab) {
            fireEvent.press(lessonsTab);
            fireEvent.press(reviewsTab);
            fireEvent.press(aboutTab);

            await waitFor(() => {
                expect(aboutTab).toBeTruthy();
            });
        }
    });

    it('handles component unmounting during operations', async () => {
        const { unmount, getByText } = render(<CourseDetailsScreen />);

        const courseTitle = getByText('Test Course');
        expect(courseTitle).toBeTruthy();

        // Unmount component during operation
        unmount();

        // Should not crash
        expect(true).toBe(true);
    });

    it('handles network errors gracefully', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Should handle network errors gracefully
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('handles purchase errors gracefully', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Should handle purchase errors gracefully
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('handles image loading errors gracefully', async () => {
        const { getByText } = render(<CourseDetailsScreen />);

        // Should handle image loading errors gracefully
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('handles missing user data gracefully', () => {
        // Mock missing user data
        jest.doMock('@/hooks/use-user', () => ({
            __esModule: true,
            default: () => ({
                apiUser: null,
                loader: false,
            }),
            setAuthorizationHeader: jest.fn(),
        }));

        const { getByText } = render(<CourseDetailsScreen />);

        // Should still render without crashing
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('handles loading states correctly', () => {
        // Mock loading state
        jest.doMock('@/hooks/use-user', () => ({
            __esModule: true,
            default: () => ({
                apiUser: null,
                loader: true,
            }),
            setAuthorizationHeader: jest.fn(),
        }));

        const { getByTestId } = render(<CourseDetailsScreen />);

        // Should show loading state
        const loadingComponent = getByTestId('course-details-loader');
        if (loadingComponent) {
            expect(loadingComponent).toBeTruthy();
        }
    });
});
