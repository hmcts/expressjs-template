import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sourceFiles = ['**/*.{js,cjs,mjs,ts,cts,mts}'];
const typescriptFiles = ['**/*.{ts,cts,mts}'];
const vitestFiles = ['src/test/unit/**/*.{js,ts}', 'src/test/routes/**/*.{js,ts}', 'src/test/smoke/**/*.{js,ts}'];

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '.yarn/**',
      '.pnp.*',
      'src/main/public/**',
      'src/main/views/govuk/**',
      '**/*.d.ts',
      'src/main/types/**',
      'src/test/config.ts',
      'functional-output/**',
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
    ...vitest.configs.recommended,
    files: vitestFiles,

    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/prefer-to-have-length': 'error',
      'vitest/valid-expect': 'off',
    },
  },
]);
