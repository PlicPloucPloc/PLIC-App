import { defineConfig } from 'eslint-define-config';
import { baseConfig } from './eslint.config.mjs';

const overrideRules = {
  'prettier/prettier': 'warn',
  'sort-imports': [
    'warn',
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
    },
  ],
  'import/order': [
    'warn',
    {
      groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
      pathGroups: [
        {
          pattern: '@(react|react-native)',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '@src/**',
          group: 'internal',
        },
      ],
      pathGroupsExcludedImportTypes: ['internal', 'react'],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  'no-unused-vars': 'off',
  'typescript/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
};

const fullConfig = baseConfig.map((entry) => {
  if ('rules' in entry) {
    return {
      ...entry,
      rules: {
        ...entry.rules,
        ...overrideRules,
      },
    };
  }
  return entry;
});

export default defineConfig(fullConfig);
