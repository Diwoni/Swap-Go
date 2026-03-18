import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import { useAuthInit } from '@/features/auth/hooks/useAuthInit';
import { LoginModal } from '@/features/auth/ui';
import { ModalProvider } from '@/shared/context/ModalProvider';
import { QueryErrorBoundary, ToastSubscriber } from '@/shared/ui';

import { QueryClientBoundary } from './QueryClientBoundary';
import { routes } from './router/routes';

function AppRoutes() {
  const element = useRoutes(routes);

  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

function AppContent() {
  const { isInitialized } = useAuthInit();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">앱 초기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <LoginModal />
    </>
  );
}

export function Providers() {
  return (
    <BrowserRouter>
      <QueryClientBoundary>
        <ModalProvider>
          <ToastSubscriber />
          <Toaster />
          <QueryErrorBoundary>
            <AppContent />
          </QueryErrorBoundary>
        </ModalProvider>
      </QueryClientBoundary>
    </BrowserRouter>
  );
}
