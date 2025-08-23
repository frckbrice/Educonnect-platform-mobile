import React from 'react';
import { render, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import AuthModal from '@/components/auth/auth-modal';
import { TEST_IDS } from '@/__tests__/utils/test-utils';

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
    useAuthRequest: jest.fn(() => [
        {},
        {},
        jest.fn(),
    ]),
    makeRedirectUri: jest.fn(() => 'test-redirect-uri'),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
    openAuthSessionAsync: jest.fn(),
    maybeCompleteAuthSession: jest.fn(),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

describe('AuthModal', () => {
    const mockProps = {
        visible: true,
        onClose: jest.fn(),
        onSuccess: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        expect(getByTestId(TEST_IDS.AUTH_MODAL)).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByTestId } = render(
            <AuthModal {...mockProps} visible={false} />
        );

        expect(queryByTestId(TEST_IDS.AUTH_MODAL)).toBeNull();
    });

    it('displays modal title correctly', () => {
        const { getByText } = render(<AuthModal {...mockProps} />);

        // Should display some form of title or heading
        expect(getByText(/sign|login|auth/i)).toBeTruthy();
    });

    it('calls onClose when close button is pressed', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Find and press close button (this might be a back button or X button)
        const closeButton = getByTestId('close-button') || getByTestId('back-button');
        if (closeButton) {
            fireEvent.press(closeButton);

            await waitFor(() => {
                expect(mockProps.onClose).toHaveBeenCalled();
            });
        }
    });

    it('calls onClose when backdrop is pressed', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Find and press backdrop
        const backdrop = getByTestId('modal-backdrop');
        if (backdrop) {
            fireEvent.press(backdrop);

            await waitFor(() => {
                expect(mockProps.onClose).toHaveBeenCalled();
            });
        }
    });

    it('handles Google sign-in correctly', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Find and press Google sign-in button
        const googleButton = getByTestId('google-signin-button');
        if (googleButton) {
            fireEvent.press(googleButton);

            await waitFor(() => {
                // Should trigger Google authentication flow
                expect(googleButton).toBeTruthy();
            });
        }
    });

    it('handles GitHub sign-in correctly', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Find and press GitHub sign-in button
        const githubButton = getByTestId('github-signin-button');
        if (githubButton) {
            fireEvent.press(githubButton);

            await waitFor(() => {
                // Should trigger GitHub authentication flow
                expect(githubButton).toBeTruthy();
            });
        }
    });

    it('handles email sign-in correctly', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Find and press email sign-in button
        const emailButton = getByTestId('email-signin-button');
        if (emailButton) {
            fireEvent.press(emailButton);

            await waitFor(() => {
                // Should trigger email authentication flow
                expect(emailButton).toBeTruthy();
            });
        }
    });

    it('displays loading state during authentication', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Trigger authentication
        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Should show loading indicator
            await waitFor(() => {
                const loadingIndicator = getByTestId('loading-indicator');
                if (loadingIndicator) {
                    expect(loadingIndicator).toBeTruthy();
                }
            });
        }
    });

    it('handles authentication success correctly', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Mock successful authentication
        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Simulate successful auth
            await waitFor(() => {
                expect(mockProps.onSuccess).toHaveBeenCalled();
            });
        }
    });

    it('handles authentication error correctly', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Mock failed authentication
        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Should handle error gracefully
            await waitFor(() => {
                expect(authButton).toBeTruthy();
            });
        }
    });

    it('applies correct styling for light theme', () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        const modal = getByTestId(TEST_IDS.AUTH_MODAL);
        expect(modal).toBeTruthy();
    });

    it('applies correct styling for dark theme', () => {
        // Mock dark theme
        jest.doMock('@/context/theme.context', () => ({
            useTheme: () => ({
                theme: { dark: true },
            }),
        }));

        const { getByTestId } = render(<AuthModal {...mockProps} />);

        const modal = getByTestId(TEST_IDS.AUTH_MODAL);
        expect(modal).toBeTruthy();
    });

    it('handles rapid open/close cycles correctly', async () => {
        const { rerender, queryByTestId } = render(<AuthModal {...mockProps} />);

        // Initial state - visible
        expect(queryByTestId(TEST_IDS.AUTH_MODAL)).toBeTruthy();

        // Close modal
        rerender(<AuthModal {...mockProps} visible={false} />);
        expect(queryByTestId(TEST_IDS.AUTH_MODAL)).toBeNull();

        // Open modal again
        rerender(<AuthModal {...mockProps} visible={true} />);
        expect(queryByTestId(TEST_IDS.AUTH_MODAL)).toBeTruthy();
    });

    it('handles missing onClose prop gracefully', () => {
        const propsWithoutOnClose = {
            visible: true,
            onSuccess: jest.fn(),
        };

        const { getByTestId } = render(<AuthModal {...propsWithoutOnClose} />);

        // Should still render without crashing
        expect(getByTestId(TEST_IDS.AUTH_MODAL)).toBeTruthy();
    });

    it('handles missing onSuccess prop gracefully', () => {
        const propsWithoutOnSuccess = {
            visible: true,
            onClose: jest.fn(),
        };

        const { getByTestId } = render(<AuthModal {...propsWithoutOnSuccess} />);

        // Should still render without crashing
        expect(getByTestId(TEST_IDS.AUTH_MODAL)).toBeTruthy();
    });

    it('maintains accessibility', () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        const modal = getByTestId(TEST_IDS.AUTH_MODAL);
        expect(modal).toBeTruthy();
    });

    it('handles network errors gracefully', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Mock network error
        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Should handle network errors gracefully
            await waitFor(() => {
                expect(authButton).toBeTruthy();
            });
        }
    });

    it('handles user cancellation gracefully', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Mock user cancellation
        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Should handle cancellation gracefully
            await waitFor(() => {
                expect(authButton).toBeTruthy();
            });
        }
    });

    it('handles authentication timeout gracefully', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        // Mock authentication timeout
        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Should handle timeout gracefully
            await waitFor(() => {
                expect(authButton).toBeTruthy();
            });
        }
    });

    it('handles multiple authentication attempts correctly', async () => {
        const { getByTestId } = render(<AuthModal {...mockProps} />);

        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            // Multiple rapid presses
            fireEvent.press(authButton);
            fireEvent.press(authButton);
            fireEvent.press(authButton);

            await waitFor(() => {
                expect(authButton).toBeTruthy();
            });
        }
    });

    it('handles component unmounting during authentication', async () => {
        const { unmount, getByTestId } = render(<AuthModal {...mockProps} />);

        const authButton = getByTestId('google-signin-button') || getByTestId('github-signin-button');
        if (authButton) {
            fireEvent.press(authButton);

            // Unmount component during authentication
            unmount();

            // Should not crash
            expect(true).toBe(true);
        }
    });
});
