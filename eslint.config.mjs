import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import jest from 'eslint-plugin-jest';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sourceFiles = ['**/*.{js,cjs,mjs,ts,cts,mts}'];
const typescriptFiles = ['**/*.{ts,cts,mts}'];
const javascriptFiles = ['**/*.{js,cjs}'];
const testFiles = ['src/test/**/*.{js,ts}'];

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '.pnp.*',
      'src/main/public/**',
      'src/main/views/govuk/**',
      '**/*.d.ts',
      'src/main/types/**',
      'src/test/config.ts',
      'functional-output/**',
      'smoke-output/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Keep Prettier responsible for formatting rather than duplicating
  // formatting rules in ESLint.
  eslintConfigPrettier,

  {
    files: sourceFiles,

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      curly: 'error',
      eqeqeq: 'error',

      'no-console': 'warn',
      'no-duplicate-imports': [
        'error',
        {
          allowSeparateTypeImports: true,
        },
      ],
      'no-prototype-builtins': 'off',
      'no-shadow': 'error',
      'no-unneeded-ternary': [
        'error',
        {
          defaultAssignment: false,
        },
      ],

      'object-shorthand': ['error', 'properties'],

      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
    },
  },

  {
    files: typescriptFiles,

    rules: {
      'no-shadow': 'off',

      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: javascriptFiles,

    languageOptions: {
      sourceType: 'commonjs',
    },

    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    ...jest.configs['flat/recommended'],
    files: testFiles,

    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'off',
    },
  },
]);
