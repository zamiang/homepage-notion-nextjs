import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  {
    ignores: [
      '.astro/**',
      'dist/**',
      'node_modules/**',
      '.cache/**',
      'coverage/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
