import '@/styles/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './app/providers';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
