module.exports = {
    root: true,
    extends: [
        'expo',
        '@react-native',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'jsx-a11y',
        'import',
        'react-native',
    ],
    rules: {
        // TypeScript specific rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/prefer-const': 'error',
        '@typescript-eslint/no-var-requires': 'error',

        // React specific rules
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/jsx-uses-react': 'off',
        'react/jsx-uses-vars': 'error',
        'react/jsx-key': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-sort-props': 'off',
        'react/jsx-wrap-multilines': 'error',

        // React Hooks rules
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Import rules
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/no-unresolved': 'off',
        'import/named': 'off',
        'import/default': 'off',
        'import/namespace': 'off',

        // React Native specific rules
        'react-native/no-unused-styles': 'error',
        'react-native/split-platform-components': 'error',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-color-literals': 'warn',
        'react-native/no-raw-text': 'off',

        // General rules
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-alert': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'error',
        'template-curly-spacing': 'error',
        'arrow-spacing': 'error',
        'no-duplicate-imports': 'error',
        'sort-imports': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            typescript: {},
        },
    },
    env: {
        'react-native/react-native': true,
        es2021: true,
        node: true,
        jest: true,
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
            env: {
                jest: true,
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'react-native/no-inline-styles': 'off',
            },
        },
    ],
};
