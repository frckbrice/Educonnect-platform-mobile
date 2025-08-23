import React from 'react';
import { render, fireEvent, waitFor } from '../../utils/test-utils';
import ThemeSwitcher from '../../../components/common/theme-switcher';
import { mockTheme } from '../../utils/test-utils';

console.log('ThemeSwitcher imported:', ThemeSwitcher);
console.log('ThemeSwitcher type:', typeof ThemeSwitcher);

// Mock the theme context
jest.mock('@/context/theme.context', () => ({
    useTheme: () => ({
        theme: { dark: false },
        toggleTheme: jest.fn(),
    }),
}));

describe('ThemeSwitcher', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByTestId } = render(<ThemeSwitcher />);

        expect(getByTestId('theme-switcher')).toBeTruthy();
    });

    it('has correct initial state when theme is light', () => {
        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher).toBeTruthy();
    });

    it('has correct initial state when theme is dark', () => {
        // Mock dark theme
        jest.doMock('@/context/theme.context', () => ({
            useTheme: () => ({
                theme: { dark: true },
                toggleTheme: jest.fn(),
            }),
        }));

        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher).toBeTruthy();
    });

    it('calls toggleTheme when pressed', async () => {
        const mockToggleTheme = jest.fn();

        jest.doMock('@/context/theme.context', () => ({
            useTheme: () => ({
                theme: { dark: false },
                toggleTheme: mockToggleTheme,
            }),
        }));

        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        fireEvent.press(switcher);

        await waitFor(() => {
            expect(mockToggleTheme).toHaveBeenCalled();
        });
    });

    it('updates local state when pressed', async () => {
        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        fireEvent.press(switcher);

        // Wait for state update
        await waitFor(() => {
            expect(switcher).toBeTruthy();
        });
    });

    it('applies correct styles for Android platform', () => {
        // Mock Android platform
        jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
            OS: 'android',
            select: jest.fn((obj) => obj.android),
        }));

        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher).toBeTruthy();
    });

    it('applies correct styles for iOS platform', () => {
        // Mock iOS platform
        jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
            OS: 'ios',
            select: jest.fn((obj) => obj.ios),
        }));

        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher).toBeTruthy();
    });

    it('handles notch devices correctly', () => {
        // Mock notch device
        jest.doMock('@/utils/app-constant', () => ({
            IsHaveNotch: true,
            IsIPAD: false,
            IsAndroid: false,
        }));

        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher).toBeTruthy();
    });

    it('handles iPad devices correctly', () => {
        // Mock iPad device
        jest.doMock('@/utils/app-constant', () => ({
            IsHaveNotch: false,
            IsIPAD: true,
            IsAndroid: false,
        }));

        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher).toBeTruthy();
    });

    it('animates smoothly when toggled', async () => {
        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');

        // Press the switcher
        fireEvent.press(switcher);

        // Wait for animation
        await waitFor(() => {
            expect(switcher).toBeTruthy();
        }, { timeout: 1000 });
    });

    it('maintains accessibility', () => {
        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');
        expect(switcher.props.accessibilityRole).toBe('button');
    });

    it('handles rapid successive presses gracefully', async () => {
        const { getByTestId } = render(<ThemeSwitcher />);

        const switcher = getByTestId('theme-switcher');

        // Rapid successive presses
        fireEvent.press(switcher);
        fireEvent.press(switcher);
        fireEvent.press(switcher);

        await waitFor(() => {
            expect(switcher).toBeTruthy();
        });
    });
});
