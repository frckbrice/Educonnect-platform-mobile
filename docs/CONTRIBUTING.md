# Contributing to EduConnected Mobile Platform

Thank you for your interest in contributing to EduConnected. This guide explains our development process and how to get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

This project is governed by our Code of Conduct. By participating, you are expected to uphold it.

### Our Standards

- Be respectful and inclusive of all contributors
- Be collaborative and open to different viewpoints
- Be constructive in feedback and criticism
- Be professional in all interactions

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- Yarn 1.22.0 or higher
- Git 2.20.0 or higher
- Expo CLI (latest)

### First Time Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/educonnected-mobile-platform.git
cd educonnected-mobile-platform

# Add upstream remote
git remote add upstream https://github.com/franckbriceavom/educonnected-mobile-platform.git

# Install dependencies
yarn install

# Setup development environment
node scripts/setup-dev.js

# Create and configure environment file
cp env.example .env
# Edit .env with your configuration
```

### Development Environment

```bash
# Start development server
yarn start

# Run tests
yarn test

# Lint code
yarn lint

# Format code
yarn format
```

## Development Setup

### Required Tools

- VS Code with recommended extensions
- React Native Debugger for debugging
- Flipper for platform debugging
- Expo Dev Tools for development utilities

### VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-react-native",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

### Git Configuration

```bash
# Configure Git hooks
yarn prepare

# Set up commit message template
git config commit.template .gitmessage
```

## Making Changes

### Branch Strategy

```bash
# Create feature branch from main
git checkout main
git pull upstream main
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/update-readme
```

### Development Workflow

1. **Plan**: Understand the requirement and plan your approach
2. **Code**: Implement the feature with tests
3. **Test**: Ensure all tests pass and add new tests
4. **Lint**: Fix any linting or formatting issues
5. **Commit**: Use conventional commit format
6. **Push**: Push your branch and create a PR

### Code Style Guidelines

#### TypeScript

```typescript
// Use strict typing
interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Use proper type annotations
const getUser = async (id: string): Promise<User | null> => {
  // Implementation
};

// Use enums for constants
enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}
```

#### React Components

```typescript
// Use functional components with hooks
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [onPress, disabled]);

  const buttonStyle = useMemo(() => {
    return {
      backgroundColor: variant === 'primary' ? '#12BB70' : '#4A90E2',
      opacity: disabled ? 0.5 : 1,
    };
  }, [variant, disabled]);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

#### File Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useUser.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)

### Import Organization

```typescript
// 1. React and React Native imports
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Third-party library imports
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// 3. Local imports (absolute paths)
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types/user';

// 4. Relative imports
import { styles } from './styles';
```

## Testing

### Testing Requirements

- **Unit Tests**: Required for all components and utilities
- **Integration Tests**: Required for complex interactions
- **Coverage**: Minimum 70% code coverage
- **Performance**: No performance regressions

### Test Structure

See [TESTING.md](TESTING.md) for test structure examples and running tests.

### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Run specific test file
yarn test -- Button.test.tsx

# Run tests in watch mode
yarn test --watch

# Run tests in CI mode
yarn test:ci
```

## Pull Request Process

### Before Submitting

1. **Tests Pass**: Ensure all tests pass locally
2. **Linting Clean**: Fix all ESLint and Prettier issues
3. **Type Check**: Verify TypeScript compilation
4. **Documentation**: Update relevant documentation
5. **Screenshots**: Add screenshots for UI changes

### PR Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass locally
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Tested on web browser

## Screenshots
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Additional Notes
Any additional information or context.
```

### PR Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer reviews the code
3. **Testing**: Changes are tested on multiple platforms
4. **Approval**: PR is approved and merged

## Code Review Guidelines

### What to Look For

- **Functionality**: Does the code work as intended?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security vulnerabilities?
- **Accessibility**: Is the UI accessible to all users?
- **Testing**: Are there adequate tests?
- **Documentation**: Is the code well-documented?

### Review Comments

- Be constructive and specific
- Suggest alternatives when possible
- Ask questions to understand the approach
- Acknowledge good work and improvements

### Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance implications considered
- [ ] Security best practices followed

## Release Process

### Version Management

- **Patch**: Bug fixes (1.0.0 to 1.0.1)
- **Minor**: New features (1.0.0 to 1.1.0)
- **Major**: Breaking changes (1.0.0 to 2.0.0)

### Release Steps

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update `CHANGELOG.md`
3. **Build**: Create production builds via EAS
4. **Test**: Verify builds on devices
5. **Tag**: Create Git tag for release
6. **Deploy**: Submit to app stores
7. **Document**: Update release notes

### Release Checklist

- [ ] All tests pass
- [ ] No known critical bugs
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Release notes prepared
- [ ] Build artifacts created
- [ ] App store submissions ready

## Community Guidelines

### Communication

- Be respectful and professional
- Use inclusive language and avoid jargon
- Provide context when asking questions
- Be patient with newcomers

### Getting Help

- Search existing issues before creating new ones
- Provide detailed information when reporting bugs
- Include reproduction steps for issues
- Use appropriate issue templates

### Recognition

- Contributors are listed in `CONTRIBUTORS.md`
- Significant contributions are acknowledged in releases
- Community members are acknowledged for their work

## Additional Resources

### Documentation

- [Development Guide](DEVELOPMENT.md)
- [Testing Guide](TESTING.md)

### Tools

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Thank you for contributing to EduConnected.
