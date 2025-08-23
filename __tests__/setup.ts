import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        canGoBack: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    useGlobalSearchParams: () => ({}),
    useSegments: () => [],
    usePathname: () => '/',
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    }),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
    expoConfig: {
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: 'test-project-id',
            },
        },
    },
}));

// Mock react-native-size-matters
jest.mock('react-native-size-matters', () => ({
    scale: jest.fn((size) => size),
    verticalScale: jest.fn((size) => size),
    moderateScale: jest.fn((size) => size),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => { });

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() },
        },
    })),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({
        width: 375,
        height: 812,
        scale: 3,
        fontScale: 1,
    }),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: 'SafeAreaView',
    useSafeAreaInsets: () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }),
    useSafeAreaFrame: () => ({
        x: 0,
        y: 0,
        width: 375,
        height: 812,
    }),
}));

// Mock expo-blur
jest.mock('expo-blur', () => ({
    BlurView: 'BlurView',
}));

// Mock expo-image
jest.mock('expo-image', () => ({
    Image: 'Image',
}));

// Mock expo-font
jest.mock('expo-font', () => ({
    useFonts: jest.fn(() => [true]),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    getExpoPushTokenAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
    addNotificationReceivedListener: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
    makeRedirectUri: jest.fn(() => 'test-redirect-uri'),
    useAuthRequest: jest.fn(() => [
        {},
        {},
        jest.fn(),
    ]),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
    maybeCompleteAuthSession: jest.fn(),
    openAuthSessionAsync: jest.fn(),
}));

// Mock react-native-iap
jest.mock('react-native-iap', () => ({
    initConnection: jest.fn(),
    getProducts: jest.fn(),
    getSubscriptions: jest.fn(),
    purchaseProduct: jest.fn(),
    purchaseSubscription: jest.fn(),
    finishTransaction: jest.fn(),
}));

// Mock moment
jest.mock('moment', () => {
    const moment = jest.requireActual('moment');
    return moment;
});

// Mock jose
jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
    SignJWT: jest.fn(),
    decodeJwt: jest.fn(),
}));

// Global test utilities
global.fetch = jest.fn();

// Mock console methods in tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Setup global test environment
beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.restoreAllMocks();
});
