# Testing Guide

This document describes the testing setup and practices for the EduConnected Mobile Platform.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Mocking](#mocking)
- [Coverage](#coverage)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The testing strategy uses a multi-layered approach:

- **Unit Tests**: Individual components and functions in isolation
- **Integration Tests**: Component interactions and API integrations
- **End-to-End Tests**: Complete user workflows
- **Coverage Reports**: Adequate test coverage across the codebase

## Testing Stack

### Core Testing Libraries

- **Jest**: JavaScript testing framework
- **React Native Testing Library**: React Native component testing utilities
- **@testing-library/jest-native**: Additional Jest matchers for React Native

### Additional Tools

- **jest-expo**: Expo-specific Jest configuration
- **Custom Test Runner**: Advanced test execution and management
- **Mock System**: Mocking for external dependencies

## Test Structure

```
__tests__/
├── setup.ts                    # Global test setup and mocks
├── utils/
│   └── test-utils.tsx         # Test utilities and helpers
├── components/
│   ├── common/                # Common component tests
│   │   ├── theme-switcher.test.tsx
│   │   ├── ratings.test.tsx
│   │   ├── skeleton.test.tsx
│   │   └── gradient-text.test.tsx
│   ├── card/                  # Card component tests
│   │   ├── course-card.test.tsx
│   │   └── review-card.test.tsx
│   ├── auth/                  # Authentication component tests
│   │   └── auth-modal.test.tsx
│   └── screen/                # Screen component tests
│       └── courses/
│           └── course-details.test.tsx
├── integration/                # Integration tests
└── e2e/                       # End-to-end tests
```

## Running Tests

### Quick Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests for specific file/pattern
npm run test:file course-details
npm run test:file auth-modal

# Show test status
npm run test:status
```

### Advanced Test Runner

```bash
# Setup test environment
node scripts/run-tests.js setup

# Run specific test configurations
node scripts/run-tests.js unit
node scripts/run-tests.js coverage
node scripts/run-tests.js watch

# Run tests matching pattern
node scripts/run-tests.js file course-details

# Debug mode
node scripts/run-tests.js debug
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "node scripts/run-tests.js unit",
    "test:integration": "node scripts/run-tests.js integration",
    "test:e2e": "node scripts/run-tests.js e2e",
    "test:watch": "node scripts/run-tests.js watch",
    "test:debug": "node scripts/run-tests.js debug",
    "test:file": "node scripts/run-tests.js file",
    "test:status": "node scripts/run-tests.js status",
    "test:setup": "node scripts/run-tests.js setup"
  }
}
```

## Writing Tests

### Test File Naming Convention

- **Unit Tests**: `component-name.test.tsx`
- **Integration Tests**: `feature-name.integration.test.tsx`
- **End-to-End Tests**: `workflow-name.e2e.test.tsx`

### Basic Test Structure

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    // Component props
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ComponentName {...defaultProps} />);
    expect(getByTestId('component-id')).toBeTruthy();
  });

  it('handles user interactions correctly', async () => {
    const { getByText } = render(<ComponentName {...defaultProps} />);

    const button = getByText('Click Me');
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Clicked!')).toBeTruthy();
    });
  });

  it('handles edge cases gracefully', () => {
    const { getByText } = render(<ComponentName {...defaultProps} />);

    // Test edge case handling
    expect(getByText('Default Text')).toBeTruthy();
  });
});
```

### Test Categories

#### 1. Rendering Tests

- Component renders without crashing
- Correct props are applied
- Default values are displayed

#### 2. Interaction Tests

- User input handling
- Button presses
- Form submissions
- Navigation actions

#### 3. State Tests

- State changes on user actions
- Loading states
- Error states
- Success states

#### 4. Edge Case Tests

- Missing props
- Invalid data
- Network errors
- Empty states

#### 5. Accessibility Tests

- Screen reader support
- Keyboard navigation
- Focus management

## Test Utilities

### Custom Render Function

```typescript
import { render } from '@/__tests__/utils/test-utils';

// Automatically includes theme provider and other context providers
const { getByText, getByTestId } = render(<Component />);
```

### Mock Data Factories

```typescript
import { createMockCourse, createMockUser } from '@/__tests__/utils/test-utils';

const mockCourse = createMockCourse({
  name: 'Custom Course Name',
  price: '19.99'
});

const mockUser = createMockUser({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Test IDs

```typescript
import { TEST_IDS } from '@/__tests__/utils/test-utils';

// Use consistent test IDs across tests
expect(getByTestId(TEST_IDS.COURSE_CARD)).toBeTruthy();
```

### Async Helpers

```typescript
import { waitForAnimation, mockAsyncOperation } from '@/__tests__/utils/test-utils';

// Wait for animations to complete
await waitForAnimation();

// Mock async operations
const result = await mockAsyncOperation('success', 100);
```

## Mocking

### Automatic Mocks

The test setup mocks common dependencies:

- **Expo Router**: Navigation and routing
- **React Native APIs**: Platform, Dimensions, etc.
- **External Libraries**: Axios, AsyncStorage, etc.
- **Native Modules**: IAP, notifications, etc.

### Custom Mocks

```typescript
// Mock specific modules
jest.mock('@/hooks/use-user', () => ({
  __esModule: true,
  default: () => ({
    apiUser: { id: 'test-user' },
    loader: false,
  }),
}));

// Mock function implementations
const mockFunction = jest.fn().mockReturnValue('mocked-value');
```

### Mock Verification

```typescript
// Verify mocks were called correctly
expect(mockFunction).toHaveBeenCalledWith('expected-arg');
expect(mockFunction).toHaveBeenCalledTimes(1);

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Coverage

### Coverage Goals

- **Global Coverage**: 70% minimum
- **Component Coverage**: 80% minimum
- **Critical Paths**: 90% minimum

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### Coverage Configuration

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
},
```

## Best Practices

### 1. Test Organization

- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Data

- Use mock data factories
- Keep test data realistic
- Avoid hardcoded values

### 3. Assertions

- Test one thing per test
- Use specific assertions
- Avoid testing implementation details

### 4. Async Testing

- Use `waitFor` for async operations
- Handle loading states
- Test error scenarios

### 5. Component Testing

- Test user interactions
- Verify visual feedback
- Test accessibility features

### 6. Mock Management

- Mock at the right level
- Keep mocks simple
- Verify mock usage

## Troubleshooting

### Common Issues

#### 1. Test Setup Errors

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules && npm install
```

#### 2. Mock Issues

```typescript
// Ensure mocks are in setup file
// Check import order
// Verify mock implementation
```

#### 3. Async Test Failures

```typescript
// Use waitFor for async operations
// Increase timeout if needed
// Check for unhandled promises
```

#### 4. Component Rendering Issues

```typescript
// Check component dependencies
// Verify mock implementations
// Test component in isolation
```

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Use console.log for debugging
console.log('Debug info:', component);
```

### Performance Issues

```bash
# Run specific test files
npm run test:file component-name

# Use Jest's --runInBand flag
npx jest --runInBand
```

## Additional Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)

### Examples

- Check existing test files for patterns
- Use test utilities for common scenarios
- Follow established naming conventions

### Support

- Review test output for specific errors
- Check Jest configuration
- Verify mock implementations

## Getting Started

1. **Setup Test Environment**

   ```bash
   npm run test:setup
   ```

2. **Run Initial Tests**

   ```bash
   npm test
   ```

3. **Write Your First Test**

   - Choose a simple component
   - Follow the test structure
   - Use existing tests as examples

4. **Expand Coverage**

   - Add more test cases
   - Test edge cases
   - Improve mock coverage

---

Good tests document behavior and catch bugs before they reach production.
