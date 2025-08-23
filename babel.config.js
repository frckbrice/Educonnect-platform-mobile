module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ['babel-preset-expo', { jsxImportSource: 'react' }],
            '@babel/preset-env',
        ],
        plugins: [
            // Module resolver for absolute imports
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@': './',
                        '@components': './components',
                        '@screens': './components/screen',
                        '@utils': './utils',
                        '@config': './config',
                        '@context': './context',
                        '@hooks': './hooks',
                        '@assets': './assets',
                        '@types': './types',
                    },
                    extensions: [
                        '.ios.ts',
                        '.android.ts',
                        '.ts',
                        '.ios.tsx',
                        '.android.tsx',
                        '.tsx',
                        '.js',
                        '.jsx',
                        '.json',
                    ],
                },
            ],
            // React Native Reanimated plugin (must be last)
            'react-native-reanimated/plugin',
        ],
        env: {
            production: {
                plugins: ['transform-remove-console'],
            },
            test: {
                plugins: ['@babel/plugin-transform-modules-commonjs'],
            },
        },
    };
};
