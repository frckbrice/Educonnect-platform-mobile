// React setup for Jest tests
import React from 'react';

// Define React Native globals
(global as any).__DEV__ = true;
(global as any).__METRO_GLOBAL_PREFIX__ = '';

// Mock React Native components
jest.mock('react-native', () => ({
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    Image: 'Image',
    ActivityIndicator: 'ActivityIndicator',
    Dimensions: { get: () => ({ width: 375, height: 667 }) },
    Platform: { OS: 'ios' },
    StyleSheet: { create: (styles: any) => styles },
    Animated: {
        Value: class {
            value: any;
            constructor(initial: any) { this.value = initial; }
            setValue(value: any) { this.value = value; }
            interpolate(config: any) { return this; }
        },
        timing: (value: any, config: any) => ({ start: (callback: any) => callback && callback() }),
        parallel: (animations: any[]) => ({ start: (callback: any) => callback && callback() }),
        event: (mapping: any[], config: any) => ({}),
        add: (a: any, b: any) => a,
    },
}));

// Mock expo modules
jest.mock('expo', () => ({
    BlurView: 'BlurView',
    Image: 'Image',
    Font: 'Font',
    Haptics: 'Haptics',
    Notifications: 'Notifications',
    SecureStore: 'SecureStore',
    AuthSession: 'AuthSession',
    WebBrowser: 'WebBrowser',
    SplashScreen: 'SplashScreen',
    StatusBar: 'StatusBar',
    LinearGradient: 'LinearGradient',
    Skeleton: 'Skeleton',
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
    default: {
        expoConfig: { name: 'test-app', slug: 'test-app', version: '1.0.0' },
        manifest: { name: 'test-app', slug: 'test-app', version: '1.0.0' },
    },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useGlobalSearchParams: () => ({}),
    useLocalSearchParams: () => ({}),
}));

// Global fetch mock
global.fetch = jest.fn();

// Console mocks
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};
