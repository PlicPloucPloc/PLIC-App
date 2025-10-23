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
    name: 'override-expo-config',
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'eqeqeq': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'prefer-const': 'error',
      'no-undef': 'error',
    },
  },
]);

export default defineConfig(baseConfig);
