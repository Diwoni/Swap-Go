import { setupWorker } from 'msw/browser';
import { authHandlers, users, refreshTokens } from './auth.handlers';
import { exposeUtilsToWindow } from './mocksUtil';

// MSW 워커 생성
export const worker = setupWorker(...authHandlers);

// 개발 환경에서만 MSW 시작
export const startMockServer = async () => {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass', // 핸들러가 없는 요청은 실제 API로 전달
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('🔶 MSW Mock Server started');

    // 디버깅 유틸리티 노출
    exposeUtilsToWindow(users, refreshTokens);
  }
};
