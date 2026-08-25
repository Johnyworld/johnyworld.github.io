import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import next from '@next/eslint-plugin-next';

export default tseslint.config(
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  next.configs['core-web-vitals'],
  prettierRecommended,
  {
    // 루트의 CommonJS 설정 파일들은 require() 를 써야 합니다.
    files: ['*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      // App Router 에서는 root layout 이 폰트 link 의 올바른 위치입니다.
      // 이 규칙은 Pages Router 의 _document.js 를 전제로 합니다.
      '@next/next/no-page-custom-font': 'off',
      // GitHub Pages 정적 export 에는 이미지 최적화 서버가 없어
      // next/image(unoptimized) 는 이점 없이 JS 만 늘립니다.
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
    },
  },
);
