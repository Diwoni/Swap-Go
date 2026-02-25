import '@/styles/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './app/providers';
import { startMockServer } from './mocks/browser';

const root = createRoot(document.getElementById('root')!);

const bootstrap = () => {
  root.render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>
  );
};

const isDev = import.meta.env.DEV;
const useMsw = isDev && import.meta.env.VITE_USE_MSW !== 'false';

if (isDev && !import.meta.env.VITE_API_BASE_URL) {
  console.warn('[Swap-Go] VITE_API_BASE_URL is not set.');
}

if (useMsw) {
  startMockServer().then(bootstrap);
} else {
  bootstrap();
}
