// @ts-check
import eslint from '@eslint/js';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'src/api/modules/esp/types/esp.schema.d.ts',
      'src/api/modules/asics/types/asics.schema.d.ts',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/deprecation': 'warn',
    },
  },
  {
    files: ['**/*.mock.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/no-hardcoded-ip': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/no-hardcoded-ip': 'off',
    },
  },
);
