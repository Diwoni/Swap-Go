import { createRoot } from 'react-dom/client';
import '@/styles/index.css';

import { Providers } from './app/providers';
import React from 'react';

// 개발 환경에서만 MSW 활성화
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');

    return worker.start({
      onUnhandledRequest: 'bypass', // 매칭되지 않는 요청은 그냥 통과
    });
  }
}

const root = createRoot(document.getElementById('root')!);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>
  );
});
