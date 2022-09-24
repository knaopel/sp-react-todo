require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides:[
    {
      files:['*.ts','*.tsx'],
      parser: '@typescript-eslint/parser',
      'parserOptions':{
        'project': './tsconfig.json',
        'ecmaVersion':2018,
        'sourceType':'module'
      },
      rules: {
        '@typescript-eslint/ban-types': [
          1,{
            extendDefaults: false,
            types: {
              String:{
                message: 'Use \'string\' instead',
                fixWith: 'string'
              },
              Boolean:{
                message: 'Use \'boolean\' instead',
                fixWith: 'boolean'
              },
              Object:{
                message: 'Use \'object\' instead, or else define a proper TypeScript type:',
              },
              Symbol:{
                message: 'Use \'symbol\' instead',
                fixWith: 'symbol'
              },
              Function:{
                message: 'The \'Function\' type accepts and function-like value.\nIt provides no type safety when calling the function, which can be a common source of bugs.\nIt also accepts things like class declarations, which will throw a runtime as they will not be called with \'new\'.\nIf you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
              },
            }
          }
        ],
        '@typescript-eslint/no-inferrable-types': 0,
        // '@microsoft/spfx/no-async-await': 'off',
        'react/jsx-no-bind': 'off',
      },
    },
    {
      // For unit tests, we can be a little bit less strict.  The settings below revise the
      // defaults specified in the extended configurations, as well as above.
      files: [
        // Test files
        '*.test.ts',
        '*.test.tsx',
        '*.spec.ts',
        '*.spec.tsx',

        // Facebook convention
        '**/__mocks__/*.ts',
        '**/__mocks__/*.tsx',
        '**/__tests__/*.ts',
        '**/__tests__/*.tsx',

        // Microsoft convention
        '**/test/*.ts',
        '**/test/*.tsx'
      ],
      rules: {
        'no-new': 0,
        'class-name': 0,
        'export-name': 0,
        forin: 0,
        'label-position': 0,
        'member-access': 2,
        'no-arg': 0,
        'no-console': 0,
        'no-construct': 0,
        'no-duplicate-variable': 2,
        'no-eval': 0,
        'no-function-expression': 2,
        'no-internal-module': 2,
        'no-shadowed-variable': 2,
        'no-switch-case-fall-through': 2,
        'no-unnecessary-semicolons': 2,
        'no-unused-expression': 2,
        'no-with-statement': 2,
        semicolon: 2,
        'trailing-comma': 0,
        typedef: 0,
        'typedef-whitespace': 0,
        'use-named-parameter': 2,
        'variable-name': 0,
        whitespace: 0
      }
    }
  ]

};
