// Config used by the IDE
// Disable some warnings and errors

import { defineConfig } from 'eslint-define-config';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginExpo from 'eslint-plugin-expo';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';

export const baseConfig = defineConfig([
  {
    ignores: ['node_modules/**', 'expo/**', 'metro.config.js', '.expo/**'],
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
    },
    plugins: {
      import: pluginImport,
      prettier: pluginPrettier,
      expo: pluginExpo,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
]);

export default baseConfig;
