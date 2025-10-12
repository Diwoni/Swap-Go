import { createRoot } from 'react-dom/client';
import '@/styles/index.css';

import { Providers } from './app/providers';
import React from 'react';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
