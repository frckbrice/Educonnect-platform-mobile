
# EduConnected Mobile Platform 


A comprehensive cross-platform mobile learning management system built with React Native and Expo, designed to provide an exceptional educational experience for both learners and educators.


##  Design Philosophy

Our UI/UX design focuses on:
- **Accessibility**: Inclusive design for all users
- **Modern Aesthetics**: Clean, intuitive interfaces
- **Mobile-First**: Optimized for mobile learning experiences
- **Consistent Design Language**: Unified visual identity across all screens

##  Platform Support

- **iOS**: Native iOS experience with platform-specific optimizations
- **Android**: Material Design principles with Android-specific features
- **Web**: Responsive web interface for cross-platform accessibility

---

##  Features

### Core Learning Features
- **Course Management**: Comprehensive course catalog with search and filtering
- **Interactive Lessons**: Video lessons with progress tracking
- **Progress Monitoring**: Real-time learning analytics and achievements
- **Social Learning**: Community features and peer collaboration

### Technical Features
- **Cross-Platform**: Single codebase for iOS, Android, and Web
- **Offline Support**: Download courses for offline learning
- **Push Notifications**: Stay updated with course progress and new content
- **Secure Authentication**: OAuth 2.0 with Google and GitHub integration

### Developer Experience
- **TypeScript**: Full type safety and better development experience
- **Modern Tooling**: ESLint, Prettier, Husky, and comprehensive testing
- **Component Library**: Reusable UI components with Storybook documentation
- **Performance**: Optimized for smooth animations and fast loading

## Technology Stack

### Frontend Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe development
- **React Navigation**: Native navigation components

### State Management & Data
- **React Context**: Lightweight state management
- **Axios**: HTTP client for API communication
- **Secure Storage**: Encrypted credential storage
- **Async Storage**: Local data persistence

### UI & Animation
- **React Native Reanimated**: Smooth, native animations
- **Moti**: Declarative animation library
- **Expo Blur**: Native blur effects
- **Custom Components**: Tailored UI components

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Jest**: Comprehensive testing framework
- **Husky**: Git hooks for quality assurance

##  Prerequisites

- **Node.js** 18+
- **Yarn** 1.22.0 or higher (recommended) or **npm** 8.0.0 or higher
- **Expo CLI** latest version
- **Git** 2.20.0 or higher
- **iOS Simulator** (for iOS development, macOS only)
- **Android Studio** (for Android development)

##  Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/franckbriceavom/educonnected-mobile-platform.git
cd educonnected-mobile-platform

# Run automated setup script
node scripts/setup-dev.js
```

### Option 2: Manual Setup
```bash
# Clone the repository
git clone https://github.com/franckbriceavom/educonnected-mobile-platform.git
cd educonnected-mobile-platform

# Install dependencies
yarn install

# Setup environment
cp env.example .env
# Edit .env with your configuration values

# Setup Git hooks
yarn prepare
```

### Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Required environment variables:
EXPO_PUBLIC_EAS_PROJECT_ID=your_eas_project_id
EXPO_PUBLIC_BASE_URL=your_api_base_url
GITHUB_CLIENT_ID=your_github_client_id
# ... see env.example for complete list
```

##  Development Commands

### Core Development
```bash
yarn start               # Start Expo development server
yarn android             # Run on Android device/emulator
yarn ios                 # Run on iOS simulator
yarn web                 # Run on web browser
```

### Testing & Quality
```bash
yarn test                # Run tests with coverage
yarn lint                # Lint code
yarn lint:fix            # Fix linting issues
yarn format              # Format code with Prettier
yarn format:check        # Check code formatting
```

### Build & Deploy
```bash
yarn build:android       # Build Android APK/AAB
yarn build:ios           # Build iOS app
yarn submit:android      # Submit to Google Play Store
yarn submit:ios          # Submit to Apple App Store
```

### Project Management
```bash
yarn clean               # Clean and reset project
```

## Project Structure

```
educonnected_platform_mobile/
├── app/                    # Expo Router app directory
│   ├── (routes)/          # Main app routes
│   ├── api/               # API route handlers
│   └── _layout.tsx        # Root layout component
├── components/             # Reusable UI components
│   ├── common/            # Shared components
│   ├── screen/            # Screen-specific components
│   └── card/              # Card components
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── config/                 # Configuration files
├── assets/                 # Static assets
├── public/                 # Public assets and images
│   └── images/            # App screenshots and UI assets
├── scripts/                # Development scripts
├── .storybook/             # Storybook configuration
└── docs/                   # Documentation
```

##  Testing Strategy

### Testing Framework
- **Jest**: Unit and integration testing
- **React Native Testing Library**: Component testing utilities
- **Coverage Requirements**: 70% minimum coverage for all metrics
- **Test Types**: Unit, integration, and component tests

### Testing Commands
```bash
yarn test                 # Run all tests
yarn test:coverage        # Generate coverage report
yarn test:ci              # CI-optimized test run
```

### Test Structure
```
__tests__/                # Test files
├── components/           # Component tests
├── hooks/                # Hook tests
├── utils/                # Utility function tests
└── integration/          # Integration tests
```

##  Code Quality

### Linting & Formatting
- **ESLint**: Advanced code quality with TypeScript and React Native rules
- **Prettier**: Consistent code formatting across the project
- **Husky**: Git hooks for pre-commit quality checks
- **Lint-staged**: Run linters only on staged files

### TypeScript Configuration
- **Strict Mode**: Comprehensive type checking
- **Path Aliases**: Clean import statements with `@/` prefixes
- **Type Safety**: Full type coverage for better development experience

### Git Hooks
- **Pre-commit**: Automatic linting and formatting
- **Commit-msg**: Conventional commit message validation

## Performance Optimization

### React Native Optimizations
- **Native Driver**: Hardware-accelerated animations
- **Image Optimization**: Efficient image loading and caching
- **Lazy Loading**: On-demand component loading
- **Memory Management**: Optimized memory usage

### Build Optimizations
- **Metro Bundler**: Fast JavaScript bundling
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Efficient bundle distribution

##  Security Features

### Authentication
- **OAuth 2.0**: Secure social authentication
- **JWT Tokens**: Stateless authentication
- **Secure Storage**: Encrypted credential storage
- **Token Refresh**: Automatic token renewal

### Data Protection
- **HTTPS Only**: Secure API communication
- **Input Validation**: Comprehensive data validation
- **XSS Protection**: Cross-site scripting prevention

## Deployment

### EAS Build (Expo Application Services)

Builds run in the cloud via EAS. Profiles in `eas.json`: `development`, `preview`, `production`.

**Local builds:**

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
eas build --platform all --profile production
```

**EAS Workflows:** The repo uses `.eas/workflows/build.yml` (EAS native CI/CD). It runs:
- On push to `main` or version tags (`v*`, e.g. `v1.0.0`): builds Android and iOS with the `production` profile.
- Manually: `eas workflow:run .eas/workflows/build.yml` and choose platform (all / android / ios).

Link your GitHub repo in the [Expo project GitHub settings](https://expo.dev/accounts/[account]/projects/[project]/github) so push/tag events trigger builds. No `EXPO_TOKEN` in GitHub is required for EAS Workflows.

### App store submission

After a successful build, submit from the EAS dashboard or locally:

```bash
eas submit --platform android --profile production
eas submit --platform ios --profile production
```

## Contributing

We welcome contributions. See [Contributing Guide](docs/CONTRIBUTING.md) for:
- Code of Conduct
- Development Setup
- Pull Request Process
- Code Review Guidelines

## Documentation

- [Development Guide](docs/DEVELOPMENT.md)
- [Contributing Guide](docs/CONTRIBUTING.md)
- [Testing Guide](docs/TESTING.md)

##  License

This project is licensed under the MIT License -

##  Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For continuous improvements
- **Open Source Contributors**: For making this project possible

##  Support

- **Issues**: [GitHub Issues](https://github.com/franckbriceavom/educonnected-mobile-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/franckbriceavom/educonnected-mobile-platform/discussions)
- **Documentation**: [Project Wiki](https://github.com/franckbriceavom/educonnected-mobile-platform/wiki)

---

Built by the EduConnected Team.

