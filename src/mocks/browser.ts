import { setupWorker } from 'msw/browser';

import { authHandlers, refreshTokens, users } from './auth.handlers';
import { exposeUtilsToWindow } from './mocksUtil';
import { rentalHandlers } from './rental.handlers';
import { resaleHandlers } from './resale.handlers';

// MSW 워커 생성
export const worker = setupWorker(...authHandlers, ...resaleHandlers, ...rentalHandlers);

// 개발 환경에서만 MSW 시작
export const startMockServer = async () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // localhost가 아니면 MSW 비활성화 && baseURL?.includes('localhost')
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('🔶 MSW Mock Server started');
    exposeUtilsToWindow(users, refreshTokens);
  } else {
    console.log('🌐 Real API Mode:', baseURL);
  }
};
