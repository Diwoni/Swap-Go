module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked', // 추가: 스타일 일관성
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // 추가: 접근성
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'tailwind.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.app.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-refresh',
    'simple-import-sort',
    'unused-imports',
    'jsx-a11y',
  ],
  settings: {
    react: {
      version: '19.0.0', // 명시적으로 React 19 지정
    },
  },
  rules: {
    // React
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // Import 정렬 (생산성)
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/no-unused-vars': 'off', // unused-imports가 처리
    '@typescript-eslint/consistent-type-definitions': 'off', // type vs interface 자유
    '@typescript-eslint/no-floating-promises': 'off', // async 처리 유연성
    '@typescript-eslint/no-unsafe-assignment': 'off', // any 사용 시 경고 완화
    '@typescript-eslint/no-unsafe-call': 'off', // any 함수 호출 경고 완화
    '@typescript-eslint/no-unsafe-member-access': 'off', // any 속성 접근 경고 완화

    'jsx-a11y/no-noninteractive-element-interactions': 'off', // div에 onClick 허용
    'jsx-a11y/click-events-have-key-events': 'off', // 키보드 이벤트 강제 해제
    'jsx-a11y/no-static-element-interactions': 'off', // static 요소 상호작용 허용
    'jsx-a11y/no-autofocus': 'warn', // autofocus는 경고만 (UX 문제)
  },
};
