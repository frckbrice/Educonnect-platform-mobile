# EduConnected Mobile Platform 🚀

A comprehensive cross-platform mobile learning management system built with React Native and Expo, designed to provide an exceptional educational experience for both learners and educators.

## 📱 App Screenshots & UI Showcase

### 🎯 Onboarding Experience
Our intuitive onboarding flow guides users through the platform's key features:

![Onboarding Community Exploration](public/sim_1.png)
*Explore Our Community - Discover the perfect courses to enhance your career prospects*

![Onboarding Course Completion](public/sim_2.png)
*Complete Full Course - Achieve certification with dedicated effort*

### 📚 Course Discovery & Learning
Browse through our comprehensive course catalog and dive into interactive learning:

![Popular Courses](public/sim_3.png)
*Popular Courses - Comprehensive project-based learning with real-world applications*


<!-- ### 🔐 Authentication & User Management
Secure and seamless authentication experience:

![Login Screen](public/images/screenshots/auth/login-screen.png)
*User Login - Secure access to your learning journey*

![Registration Form](public/images/screenshots/auth/registration-form.png)
*User Registration - Join our educational community*

### 👤 User Profile & Progress
Track your learning progress and achievements:

![User Profile](public/images/screenshots/profile/user-profile.png)
*User Profile - Manage your account and view progress*

![Learning Dashboard](public/images/screenshots/profile/learning-dashboard.png)
*Learning Dashboard - Monitor your educational journey* -->

## 🎨 Design Philosophy

Our UI/UX design focuses on:
- **Accessibility**: Inclusive design for all users
- **Modern Aesthetics**: Clean, intuitive interfaces
- **Mobile-First**: Optimized for mobile learning experiences
- **Consistent Design Language**: Unified visual identity across all screens

## 📱 Platform Support

- **iOS**: Native iOS experience with platform-specific optimizations
- **Android**: Material Design principles with Android-specific features
- **Web**: Responsive web interface for cross-platform accessibility

## 🔗 Image Assets

All app screenshots and UI assets are organized in the `public/images/` directory:
- **Screenshots**: Real app screens and user flows
- **Mockups**: UI/UX design concepts and wireframes
- **Icons**: App icons and interface elements
- **Diagrams**: System architecture and user journey flows

For detailed image organization and usage guidelines, see [Images Directory Documentation](public/images/README.md).

---

## 🚀 Features

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

## 🛠️ Technology Stack

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
- **Storybook**: Component development and documentation
- **Husky**: Git hooks for quality assurance

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **Yarn** 1.22.0 or higher (recommended) or **npm** 8.0.0 or higher
- **Expo CLI** latest version
- **Git** 2.20.0 or higher
- **iOS Simulator** (for iOS development, macOS only)
- **Android Studio** (for Android development)

## 🚀 Quick Setup

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

## 🎮 Development Commands

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
yarn test:coverage       # Generate coverage report
yarn test:ci             # Run tests in CI mode
yarn lint                # Lint code
yarn lint:fix            # Fix linting issues
yarn type-check          # Check TypeScript types
yarn format              # Format code with Prettier
yarn format:check        # Check code formatting
yarn check-logs          # Check for console.log statements
```

### Build & Deploy
```bash
yarn build:android       # Build Android APK/AAB
yarn build:ios           # Build iOS app
yarn build:all           # Build for all platforms
yarn submit:android      # Submit to Google Play Store
yarn submit:ios          # Submit to Apple App Store
```

### Project Management
```bash
yarn clean               # Clean and reset project
yarn storybook           # Launch Storybook
yarn storybook:build     # Build Storybook for production
```

## 🏗️ Project Structure

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

## 🧪 Testing Strategy

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

## 📏 Code Quality

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

## ⚡ Performance Optimization

### React Native Optimizations
- **Native Driver**: Hardware-accelerated animations
- **Image Optimization**: Efficient image loading and caching
- **Lazy Loading**: On-demand component loading
- **Memory Management**: Optimized memory usage

### Build Optimizations
- **Metro Bundler**: Fast JavaScript bundling
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Efficient bundle distribution

## 🔒 Security Features

### Authentication
- **OAuth 2.0**: Secure social authentication
- **JWT Tokens**: Stateless authentication
- **Secure Storage**: Encrypted credential storage
- **Token Refresh**: Automatic token renewal

### Data Protection
- **HTTPS Only**: Secure API communication
- **Input Validation**: Comprehensive data validation
- **XSS Protection**: Cross-site scripting prevention

## 🚀 Deployment

### EAS Build
- **Cloud Builds**: Automated builds in the cloud
- **Multi-Platform**: iOS, Android, and Web builds
- **Environment Management**: Separate configs for dev/staging/prod

### App Store Deployment
- **Google Play Store**: Android app distribution
- **Apple App Store**: iOS app distribution
- **Automated Submission**: Streamlined deployment process

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development Setup
- Pull Request Process
- Code Review Guidelines

## 📚 Documentation

- **Development Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **API Documentation**: [API.md](docs/API.md)
- **Component Library**: [Storybook](http://localhost:6006)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For continuous improvements
- **Open Source Contributors**: For making this project possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/franckbriceavom/educonnected-mobile-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/franckbriceavom/educonnected-mobile-platform/discussions)
- **Documentation**: [Project Wiki](https://github.com/franckbriceavom/educonnected-mobile-platform/wiki)

---

<div align="center">
  <p><strong>Empowering education through technology</strong></p>
  <p>Built with ❤️ by the EduConnected Team</p>
</div>
