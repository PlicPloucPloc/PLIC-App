// Config used in the repo
// Enable every errors and warning

import { defineConfig } from 'eslint-define-config';
import baseConfig from './eslint.config.mjs';

import pluginPrettier from 'eslint-plugin-prettier';

const config = defineConfig([
  ...baseConfig,
  {
    name: 'non-IDE-config',
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            { pattern: '@(react|react-native)', group: 'external', position: 'before' },
            { pattern: '@src/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['internal', 'react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
]);

export default config;
