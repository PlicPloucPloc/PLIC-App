// Config used by the IDE
// Disable some warnings and errors

import { defineConfig } from 'eslint-define-config';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginExpo from 'eslint-plugin-expo';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

const cleanGlobals = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([key, val]) => [key.trim(), val]));

export const baseConfig = defineConfig([
  {
    ignores: ['node_modules/**', 'expo/**', 'babel.config.js', '.expo/**'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...cleanGlobals(globals.node),
        ...cleanGlobals(globals.browser),
        NodeJS: true,
        JSX: true,
      },
    },
    plugins: {
      import: pluginImport,
      prettier: pluginPrettier,
      expo: pluginExpo,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-native': pluginReactNative,
      typescript: tsPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // typescript rules
      'require-await': 'off', // disable the base rule to use the TS version
      'typescript/require-await': 'error',

      "typescript/no-deprecated": "error",

      'typescript/consistent-type-definitions': ['error', 'type'],
      'typescript/consistent-type-imports': [
        'error',
        { prefer: 'no-type-imports', fixStyle: 'inline-type-imports' },
      ],
      'typescript/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],

      // react rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-undef': 'error',
      'prefer-const': 'error',
    },
  },
]);

export default baseConfig;
