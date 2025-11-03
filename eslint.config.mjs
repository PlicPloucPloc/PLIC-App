// Config used by the IDE
// Disable some warnings and errors

import { defineConfig } from 'eslint-define-config';
import expoConfig from 'eslint-config-expo/flat.js';

const baseConfig = defineConfig([
  ...expoConfig,
  {
    name: 'global-ignores',
    ignores: ['node_modules/**', 'babel.config.js', '.expo/**'],
  },
  {
    // disable some expo rules that are not wanted in the project
    // and enable some custom rules only valid for IDEs
    name: 'IDE-config',
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        NodeJS: true
      },
    },
    rules: {
      eqeqeq: 'off',
      'react-hooks/exhaustive-deps': 'error',
      'prefer-const': 'error',
      'no-undef': 'error',
      "@typescript-eslint/no-deprecated": "error"
    },
  },
]);

export default defineConfig(baseConfig);
