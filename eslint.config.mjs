import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default [
  { ignores: ['.next/**', 'node_modules/**', 'mghal-backend/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['public/assets/social-engagement.js'],
    languageOptions: {
      globals: {
        window: 'readonly', document: 'readonly', navigator: 'readonly', localStorage: 'readonly',
        location: 'readonly', history: 'readonly', URLSearchParams: 'readonly', CustomEvent: 'readonly',
      },
    },
  },
];
