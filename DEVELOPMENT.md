# Development Guide 🚀

This guide covers everything you need to know about developing the EduConnected Mobile Platform.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Code Quality](#code-quality)
- [Performance Optimization](#performance-optimization)
- [Security Guidelines](#security-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher
- **Yarn** 1.22.0 or higher (recommended) or **npm** 8.0.0 or higher
- **Expo CLI** latest version
- **Git** 2.20.0 or higher

### Development Tools
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - React Native Tools
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Platform-Specific Requirements
- **iOS Development**: Xcode 14.0+ (macOS only)
- **Android Development**: Android Studio, Android SDK
- **Web Development**: Modern browser with ES6+ support

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/franckbriceavom/educonnected-mobile-platform.git
cd educonnected-mobile-platform

# Run automated setup
node scripts/setup-dev.js

# Or manually:
yarn install
cp env.example .env
# Edit .env with your configuration
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your values:
EXPO_PUBLIC_EAS_PROJECT_ID=your_project_id
EXPO_PUBLIC_BASE_URL=your_api_url
GITHUB_CLIENT_ID=your_github_client_id
# ... other required values
```

### 3. Start Development
```bash
# Start development server
yarn start

# Run on specific platforms
yarn android    # Android
yarn ios        # iOS
yarn web        # Web
```

## 🏗️ Project Structure

```
educonnected_platform_mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                  # Main tab navigation
│   ├── (routes)/                # Modal and stack routes
│   └── api/                     # API route handlers
├── components/                   # Reusable UI components
│   ├── auth/                    # Authentication components
│   ├── card/                    # Content cards
│   ├── common/                  # Shared components
│   └── screen/                  # Screen-specific components
├── context/                     # React Context providers
├── hooks/                       # Custom React hooks
├── config/                      # App configuration and constants
├── utils/                       # Utility functions
├── assets/                      # Images, fonts, static resources
├── scripts/                     # Development and build scripts
├── .storybook/                  # Storybook configuration
├── .husky/                      # Git hooks
└── docs/                        # Documentation
```

## 🔄 Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "feat(component): add new button component"

# Push and create PR
git push origin feature/amazing-feature
```

### Commit Message Convention
```
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks
- perf: Performance improvements
- ci: CI/CD changes
- build: Build system changes
- revert: Revert changes

Examples:
- feat(auth): add OAuth2 authentication
- fix(ui): resolve navigation crash on Android
- docs(readme): update installation instructions
```

### Code Quality Checks
```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Check TypeScript types
yarn type-check

# Format code
yarn format

# Check formatting
yarn format:check
```

## 🧪 Testing Strategy

### Testing Levels
1. **Unit Tests**: Individual component and function testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Full user journey testing
4. **Performance Tests**: Load time and memory usage

### Running Tests
```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Run in CI mode
yarn test:ci

# Run specific test file
yarn test -- path/to/test.tsx
```

### Test Structure
```typescript
// components/Button/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Press Me" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Press Me" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Mocking Strategy
- **Expo Modules**: Mocked in `jest.setup.js`
- **React Native Modules**: Platform-specific mocks
- **Third-party Libraries**: Jest mocks or manual mocks

## 📏 Code Quality

### ESLint Configuration
- **TypeScript**: Strict type checking
- **React**: Hooks rules and JSX best practices
- **React Native**: Platform-specific rules
- **Import Order**: Organized and alphabetized imports

### Prettier Configuration
- **Line Length**: 80 characters
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing Commas**: ES5 compatible

### TypeScript Configuration
- **Strict Mode**: Enabled
- **Path Mapping**: Absolute imports with aliases
- **Type Checking**: Comprehensive error checking

### Pre-commit Hooks
- **Linting**: ESLint checks
- **Formatting**: Prettier formatting
- **Type Checking**: TypeScript compilation
- **Tests**: Unit test execution

## ⚡ Performance Optimization

### React Native Best Practices
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useCallback for event handlers
const handlePress = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### Image Optimization
```typescript
// Use Expo Image for better performance
import { Image } from 'expo-image';

// Lazy load images
<Image
  source={imageSource}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
/>
```

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Lazy load components
- **Asset Optimization**: Compress images and fonts

## 🔒 Security Guidelines

### Authentication
- **OAuth 2.0**: Secure third-party authentication
- **JWT Tokens**: Stateless authentication
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: Encrypted credential storage

### Data Protection
- **HTTPS Only**: Secure API communication
- **Input Validation**: Sanitize user inputs
- **Error Handling**: Don't expose sensitive information
- **Environment Variables**: Secure configuration management

### Code Security
- **Dependency Scanning**: Regular security audits
- **Code Review**: Security-focused code reviews
- **Access Control**: Principle of least privilege

## 🚀 Deployment

### EAS Build Configuration
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  },
  "preview": {
    "distribution": "internal"
  },
  "production": {
    "autoIncrement": true,
    "android": { "buildType": "app-bundle" },
    "ios": { "simulator": false }
  }
}
```

### Build Commands
```bash
# Development build
yarn build:android
yarn build:ios

# Production build
yarn build:all

# Submit to stores
yarn submit:android
yarn submit:ios
```

### Release Process
1. **Version Bump**: Update version in `package.json`
2. **Build**: Create production builds
3. **Test**: Verify builds on devices
4. **Submit**: Upload to app stores
5. **Monitor**: Track release metrics

## 🛠️ Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
yarn start --clear

# Reset Expo cache
expo r -c

# Clean and reinstall
yarn clean
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Reset iOS simulator
xcrun simctl erase all

# Update CocoaPods
cd ios && pod install && cd ..
```

#### Android Build Issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Reset Android emulator
adb emu kill
```

#### TypeScript Errors
```bash
# Check types
yarn type-check

# Reset TypeScript cache
rm -rf node_modules/.cache/typescript/
```

### Debug Tools
- **React Native Debugger**: Advanced debugging
- **Flipper**: Platform debugging
- **Expo Dev Tools**: Development utilities
- **Chrome DevTools**: Web debugging

### Performance Monitoring
- **FPS Monitor**: Frame rate tracking
- **Memory Profiler**: Memory usage analysis
- **Network Inspector**: API call monitoring

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://github.com/react-native-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Tools
- [Expo Snack](https://snack.expo.dev/) - Online playground
- [React Native Elements](https://reactnativeelements.com/) - UI components
- [React Native Vector Icons](https://oblador.github.io/react-native-vector-icons/) - Icon library

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/franckbriceavom/educonnected-mobile-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/franckbriceavom/educonnected-mobile-platform/discussions)
- **Email**: [support@educonnected.com](mailto:support@educonnected.com)

---

<div align="center">
  <p>Happy coding! 🚀</p>
  <p>Empowering education through technology</p>
</div>
