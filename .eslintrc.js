module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'globals': {
        // HTMLRewriter is globally defined inside cloudflare workers
        // the intended environment for this package to run in.
        'HTMLRewriter': 'readonly',

        // Must be defined as environment secrets
        'AWS_REGION': 'readonly',
        'AWS_ACCESS_KEY_ID': 'readonly',
        'AWS_SECRET_ACCESS_KEY': 'readonly',
        'AUTHORIZATION_KEY': 'readonly',
    },
    'rules': {
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'never',
        ],

        // require default case in switch statements
        'default-case': ['error', { commentPattern: '^no default$' }],

        // use dot notation wherever possible
        'dot-notation': ['error', { allowKeywords: true }],

        // requires triple equals (=== or !==)
        eqeqeq: ['error', 'always', { null: 'ignore' }],

        // https://eslint.org/docs/rules/no-else-return
        'no-else-return': ['error', { allowElseIf: false }],

        // https://eslint.org/docs/rules/no-eq-null
        'no-eq-null': 'off',

        // cannot extend native types
        'no-extend-native': 'error',

        // no fallthrough in case statements
        'no-fallthrough': 'error',

        // https://eslint.org/docs/rules/no-global-assign
        'no-global-assign': ['error', { exceptions: [] }],

        'no-invalid-this': 'off',

        // https://eslint.org/docs/rules/no-magic-numbers
        'no-magic-numbers': ['off', {
            ignore: [],
            ignoreArrayIndexes: true,
            enforceConst: true,
            detectObjects: false,
        }],

        // disallow use of multiple spaces
        'no-multi-spaces': ['error', {
            ignoreEOLComments: false,
        }],
  
        // disallow reassignment of function parameters
        // disallow parameter object manipulation except for specific exclusions
        // rule: https://eslint.org/docs/rules/no-param-reassign.html
        'no-param-reassign': ['error', {
            props: true,
            ignorePropertyModificationsFor: [
                'acc', // for reduce accumulators
                'accumulator', // for reduce accumulators
                'req', // for Express requests
                'request', // for Express requests
                'res', // for Express responses
                'response', // for Express responses
            ],
        }],
  
        // https://eslint.org/docs/rules/no-useless-catch
        'no-useless-catch': 'error',

        // https://eslint.org/docs/rules/arrow-spacing
        'arrow-spacing': ['error', { before: true, after: true }],

        'no-var': 'error',

        'prefer-const': ['error', {
            destructuring: 'any',
            ignoreReadBeforeAssign: true,
        }],

        // Prefer destructuring from arrays and objects
        // https://eslint.org/docs/rules/prefer-destructuring
        'prefer-destructuring': ['error', {
            VariableDeclarator: {
                array: false,
                object: true,
            },
            AssignmentExpression: {
                array: true,
                object: false,
            },
        }, {
            enforceForRenamedProperties: false,
        }],

        // Reports modules without any exports, or with unused exports
        // https://github.com/benmosher/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
        'import/no-unused-modules': ['off', {
            ignoreExports: [],
            missingExports: true,
            unusedExports: true,
        }],
  
        'max-len': ['error', { 'code': 120, 'ignoreComments': true }],

        'comma-dangle': ['error', 'always-multiline'],
    },
}
