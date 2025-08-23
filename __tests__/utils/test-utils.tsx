import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/context/theme.context';

// Mock theme context for testing
const mockTheme = {
    dark: false,
    toggleTheme: jest.fn(),
};

// Mock data factories
export const createMockCourse = (overrides = {}) => ({
    id: 'course-1',
    name: 'Test Course',
    title: 'Test Course Title',
    description: 'This is a test course description',
    price: '29.99',
    estimatedPrice: '49.99',
    prerequisites: [],
    benefits: [],
    courseContent: [],
    slug: 'test-course',
    purchased: 100,
    ...overrides,
});

export const createMockUser = (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    orders: [],
    ...overrides,
});

export const createMockReview = (overrides = {}) => ({
    id: 'review-1',
    comment: 'Great course!',
    rating: 5,
    user: {
        name: 'Test User',
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
});

// Test IDs for components
export const TEST_IDS = {
    THEME_SWITCHER: 'theme-switcher',
    RATING_STARS: 'rating-stars',
    COURSE_CARD: 'course-card',
    REVIEW_CARD: 'review-card',
    AUTH_MODAL: 'auth-modal',
    SPACER: 'spacer',
    GRADIENT_TEXT: 'gradient-text',
    COURSE_DETAILS: 'course-details',
};

// Mock navigation props
export const mockNavigationProps = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    route: { params: {} },
};

// Mock router props
export const mockRouterProps = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
};

// Utility functions
export const waitForAnimation = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockAsyncOperation = () => new Promise(resolve => setTimeout(resolve, 100));

export const createMockFn = () => jest.fn();

export const createMockPromise = (value: any) => Promise.resolve(value);

// Custom render function that includes providers
const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );

    return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { mockTheme };
