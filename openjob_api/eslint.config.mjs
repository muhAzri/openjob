import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nodePlugin from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'uploads/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  nodePlugin.configs['flat/recommended-module'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Strictness on top of typescript-eslint's strict/stylistic type-checked sets.
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // This codebase groups related static helpers under a class as a namespace
      // (middlewares, validators, cache keys, connection singletons). That is a
      // deliberate, consistent convention here, not an accidental empty class.
      '@typescript-eslint/no-extraneous-class': 'off',
      // Singleton/static-only classes intentionally use a private empty
      // constructor to block `new`.
      '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
      // req.params / process.env are index-signature dictionaries; bracket
      // notation communicates that intent better than dot notation here.
      '@typescript-eslint/dot-notation': ['error', { allowIndexSignaturePropertyAccess: true }],
      // Interpolating numbers (ports, ids) into template literals is safe.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      // Node-specific rules: this project targets a fixed, modern Node runtime,
      // so version-support linting from eslint-plugin-n is unnecessary noise.
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    files: ['migrations/**/*.ts'],
    rules: {
      // Migration files are invoked by node-pg-migrate, not imported by our own code.
      'n/no-unpublished-import': 'off',
      // node-pg-migrate's up/down signature is async regardless of whether a
      // given migration awaits anything internally.
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    files: ['*.mjs', '*.config.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      // This is tooling config for a private app, never an npm-published
      // package, so the "is this import published" heuristic doesn't apply.
      'n/no-unpublished-import': 'off',
    },
  },
  {
    files: ['src/server.ts'],
    rules: {
      // These are process entrypoints: exiting after logging a fatal
      // startup failure is the standard Node pattern here, not a library
      // misbehaving.
      'n/no-process-exit': 'off',
    },
  },
  eslintConfigPrettier,
);
