import { createRoot } from 'react-dom/client';
import '@/styles/index.css';

import { Providers } from './app/providers';
import React from 'react';
import { startMockServer } from './mocks/browser';

const root = createRoot(document.getElementById('root')!);

startMockServer().then(() => {
  root.render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>
  );
});

// ⭐ 자동 로그인 함수
// async function initAuth() {
//   try {
//     console.log('🔄 자동 로그인 시도 중...');

//     // refreshToken으로 accessToken 재발급
//     const { accessToken } = await authService.refreshToken();
//     // → POST /auth/refresh
//     // → Cookie: refreshToken=abc123... (자동 첨부)

//     // 새 토큰 저장
//     tokenManager.setAccessToken(accessToken);

//     console.log('✅ 자동 로그인 성공!');
//   } catch (error) {
//     console.log('❌ 자동 로그인 실패 (refreshToken 없거나 만료)');
//     tokenManager.clearAccessToken();
//   }
// }
