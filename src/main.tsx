import '@/styles/index.css';

import { createRoot } from 'react-dom/client';

import App from '@/App';

const root = createRoot(document.getElementById('root')!);

console.log('husky test');
root.render(<App />);
