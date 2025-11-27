import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { LoginModal } from '@/features/auth/ui';
import { ModalProvider } from '@/shared/context/ModalProvider';

import { routes } from './router/routes';

// App은 라우팅만 하는 역할
function AppRoutes() {
  const element = useRoutes(routes);

  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

// 앱 전체에 필요한 providers 집합 (queryClient, 컨텍스트 등)
export function Providers() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <AuthProvider>
            <AppRoutes />
            <LoginModal />
          </AuthProvider>
        </ModalProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
