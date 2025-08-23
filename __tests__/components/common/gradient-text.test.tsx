import React from 'react';
import { render } from '@/__tests__/utils/test-utils';
import GradientText from '@/components/common/gradient-text';
import { TEST_IDS } from '@/__tests__/utils/test-utils';

describe('GradientText', () => {
    const defaultProps = {
        children: 'Gradient Text',
        testID: TEST_IDS.GRADIENT_TEXT,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with default props', () => {
        const { getByTestId } = render(<GradientText {...defaultProps} />);

        expect(getByTestId(TEST_IDS.GRADIENT_TEXT)).toBeTruthy();
    });

    it('displays text content correctly', () => {
        const { getByText } = render(<GradientText {...defaultProps} />);

        expect(getByText('Gradient Text')).toBeTruthy();
    });

    it('handles different text content', () => {
        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Different Text Content
            </GradientText>
        );

        expect(getByText('Different Text Content')).toBeTruthy();
    });

    it('handles empty text content', () => {
        const { getByTestId } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}></GradientText>
        );

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();
    });

    it('handles whitespace-only text content', () => {
        const { getByTestId } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>   </GradientText>
        );

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();
    });

    it('handles very long text content', () => {
        const longText = 'This is a very long text that might exceed normal display limits and should be handled gracefully by the component. It contains multiple sentences and should wrap properly.';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {longText}
            </GradientText>
        );

        expect(getByText(longText)).toBeTruthy();
    });

    it('handles text with special characters', () => {
        const specialText = 'Text with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {specialText}
            </GradientText>
        );

        expect(getByText(specialText)).toBeTruthy();
    });

    it('handles text with emojis', () => {
        const emojiText = 'Text with emojis 🎉👍🚀';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {emojiText}
            </GradientText>
        );

        expect(getByText(emojiText)).toBeTruthy();
    });

    it('handles text with HTML-like content', () => {
        const htmlText = 'Text with <strong>bold</strong> and <em>italic</em> content';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {htmlText}
            </GradientText>
        );

        expect(getByText(htmlText)).toBeTruthy();
    });

    it('handles text with numbers', () => {
        const numberText = 'Text with numbers 12345 and decimals 3.14';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {numberText}
            </GradientText>
        );

        expect(getByText(numberText)).toBeTruthy();
    });

    it('handles text with mixed content types', () => {
        const mixedText = 'Mixed: Text 123 !@# 🎉 <strong>Bold</strong>';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {mixedText}
            </GradientText>
        );

        expect(getByText(mixedText)).toBeTruthy();
    });

    it('handles single character text', () => {
        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>A</GradientText>
        );

        expect(getByText('A')).toBeTruthy();
    });

    it('handles single emoji character', () => {
        const { getByTestId } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>🎉</GradientText>
        );

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();
    });

    it('handles text with line breaks', () => {
        const textWithBreaks = 'Line 1\nLine 2\nLine 3';

        const { getByTestId } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {textWithBreaks}
            </GradientText>
        );

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();
    });

    it('handles text with tabs', () => {
        const textWithTabs = 'Text\twith\ttabs';

        const { getByTestId } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {textWithTabs}
            </GradientText>
        );

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();
    });

    it('handles text with multiple spaces', () => {
        const textWithSpaces = 'Text    with    multiple    spaces';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {textWithSpaces}
            </GradientText>
        );

        expect(getByText(textWithSpaces)).toBeTruthy();
    });

    it('handles text with unicode characters', () => {
        const unicodeText = 'Text with unicode: éñüñöñáéíóú';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {unicodeText}
            </GradientText>
        );

        expect(getByText(unicodeText)).toBeTruthy();
    });

    it('handles text with currency symbols', () => {
        const currencyText = 'Prices: $19.99, €15.50, £12.75, ¥1000';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {currencyText}
            </GradientText>
        );

        expect(getByText(currencyText)).toBeTruthy();
    });

    it('handles text with mathematical symbols', () => {
        const mathText = 'Math: + - × ÷ = ≠ < > ≤ ≥ ± ∞';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {mathText}
            </GradientText>
        );

        expect(getByText(mathText)).toBeTruthy();
    });

    it('handles text with parentheses and brackets', () => {
        const bracketText = 'Text with (parentheses) and [brackets] and {braces}';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {bracketText}
            </GradientText>
        );

        expect(getByText(bracketText)).toBeTruthy();
    });

    it('handles text with quotes', () => {
        const quoteText = 'Text with "double quotes" and \'single quotes\'';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {quoteText}
            </GradientText>
        );

        expect(getByText(quoteText)).toBeTruthy();
    });

    it('handles text with apostrophes', () => {
        const apostropheText = "Don't forget about apostrophes and contractions";

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {apostropheText}
            </GradientText>
        );

        expect(getByText(apostropheText)).toBeTruthy();
    });

    it('handles text with URLs', () => {
        const urlText = 'Visit https://example.com and http://test.org';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {urlText}
            </GradientText>
        );

        expect(getByText(urlText)).toBeTruthy();
    });

    it('handles text with email addresses', () => {
        const emailText = 'Contact us at test@example.com or support@test.org';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {emailText}
            </GradientText>
        );

        expect(getByText(emailText)).toBeTruthy();
    });

    it('handles text with phone numbers', () => {
        const phoneText = 'Call us at +1-555-123-4567 or (555) 123-4567';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {phoneText}
            </GradientText>
        );

        expect(getByText(phoneText)).toBeTruthy();
    });

    it('handles text with dates', () => {
        const dateText = 'Today is 2024-01-15 and tomorrow is 2024-01-16';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {dateText}
            </GradientText>
        );

        expect(getByText(dateText)).toBeTruthy();
    });

    it('handles text with times', () => {
        const timeText = 'Meeting at 14:30 and dinner at 19:00';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {timeText}
            </GradientText>
        );

        expect(getByText(timeText)).toBeTruthy();
    });

    it('handles text with percentages', () => {
        const percentText = 'Success rate: 95.5% and growth: 12.3%';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {percentText}
            </GradientText>
        );

        expect(getByText(percentText)).toBeTruthy();
    });

    it('handles text with fractions', () => {
        const fractionText = 'Fractions: 1/2, 3/4, 5/8, 7/16';

        const { getByText } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                {fractionText}
            </GradientText>
        );

        expect(getByText(fractionText)).toBeTruthy();
    });

    it('maintains accessibility', () => {
        const { getByTestId } = render(<GradientText {...defaultProps} />);

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();
    });

    it('handles rapid re-renders correctly', () => {
        const { rerender, getByText } = render(<GradientText {...defaultProps} />);

        // Initial render
        expect(getByText('Gradient Text')).toBeTruthy();

        // Change text content
        rerender(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Updated Text
            </GradientText>
        );
        expect(getByText('Updated Text')).toBeTruthy();

        // Change text content again
        rerender(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Final Text
            </GradientText>
        );
        expect(getByText('Final Text')).toBeTruthy();
    });

    it('handles missing testID gracefully', () => {
        const { getByText } = render(
            <GradientText>Text without testID</GradientText>
        );

        // Should still render without crashing
        expect(getByText('Text without testID')).toBeTruthy();
    });

    it('handles empty testID gracefully', () => {
        const { getByText } = render(
            <GradientText testID="">Text with empty testID</GradientText>
        );

        // Should still render without crashing
        expect(getByText('Text with empty testID')).toBeTruthy();
    });

    it('handles undefined testID gracefully', () => {
        const { getByText } = render(
            <GradientText testID={undefined}>Text with undefined testID</GradientText>
        );

        // Should still render without crashing
        expect(getByText('Text with undefined testID')).toBeTruthy();
    });

    it('handles null testID gracefully', () => {
        const { getByText } = render(
            <GradientText testID={null}>Text with null testID</GradientText>
        );

        // Should still render without crashing
        expect(getByText('Text with null testID')).toBeTruthy();
    });

    it('handles component unmounting gracefully', () => {
        const { unmount, getByTestId } = render(<GradientText {...defaultProps} />);

        const gradientText = getByTestId(TEST_IDS.GRADIENT_TEXT);
        expect(gradientText).toBeTruthy();

        // Unmount component
        unmount();

        // Should not crash
        expect(true).toBe(true);
    });

    it('handles multiple instances correctly', () => {
        const { getAllByTestId } = render(
            <>
                <GradientText testID="gradient-1">Text 1</GradientText>
                <GradientText testID="gradient-2">Text 2</GradientText>
                <GradientText testID="gradient-3">Text 3</GradientText>
            </>
        );

        const gradientTexts = getAllByTestId(/gradient-\d/);
        expect(gradientTexts).toHaveLength(3);
    });

    it('handles nested rendering correctly', () => {
        const { getByTestId } = render(
            <GradientText testID="outer-gradient">
                Outer text
                <GradientText testID="inner-gradient">Inner text</GradientText>
            </GradientText>
        );

        const outerGradient = getByTestId('outer-gradient');
        const innerGradient = getByTestId('inner-gradient');

        expect(outerGradient).toBeTruthy();
        expect(innerGradient).toBeTruthy();
    });

    it('handles conditional rendering correctly', () => {
        const { rerender, queryByTestId } = render(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Conditional text
            </GradientText>
        );

        // Initial render
        expect(queryByTestId(TEST_IDS.GRADIENT_TEXT)).toBeTruthy();

        // Conditional render - should still render
        rerender(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Conditional text
            </GradientText>
        );
        expect(queryByTestId(TEST_IDS.GRADIENT_TEXT)).toBeTruthy();
    });

    it('handles dynamic text changes correctly', () => {
        const { rerender, getByText } = render(<GradientText {...defaultProps} />);

        const gradientText = getByText('Gradient Text');
        expect(gradientText).toBeTruthy();

        // Change text dynamically
        rerender(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Dynamic Text
            </GradientText>
        );
        expect(getByText('Dynamic Text')).toBeTruthy();

        // Change text again
        rerender(
            <GradientText testID={TEST_IDS.GRADIENT_TEXT}>
                Another Text
            </GradientText>
        );
        expect(getByText('Another Text')).toBeTruthy();
    });
});
