import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierlint from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
// @ts-expect-error
import importPlugin from 'eslint-plugin-import';

const configs = defineConfig(eslint.configs.recommended, tseslint.configs.recommended, {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    import: importPlugin,
  },
  ignores: ['eslint.config.js', '**/__assets__/'],
  rules: {
    'import/no-cycle': 'error',
    'import/newline-after-import': 'error',
    'import/max-dependencies': ['error', { max: 20 }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        distinctGroup: false,
        groups: ['builtin', 'internal', 'external', 'parent', 'sibling', 'index', 'type'],
      },
    ],
  },
});

export { configs };
