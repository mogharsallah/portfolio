import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', '.astro/', '.lighthouseci/', '.design-source/', 'node_modules/', 'public/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.{astro,ts,tsx,js,jsx,mjs,cjs}'],
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css',
      },
    },
    rules: {
      ...betterTailwind.configs['recommended-warn'].rules,
      // prettier-plugin-tailwindcss already sorts class order; avoid double-handling.
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      // Pure stylistic — prettier owns wrapping; this rule's preferred output is noisy.
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
