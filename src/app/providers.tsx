// src/app/providers/index.tsx (또는 Providers.tsx)
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './router/routes';
import { Suspense } from 'react';
import { ModalProvider } from '@/shared/context/ModalProvider';
import { LoginModal } from '@/features/auth/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthInit } from '@/features/auth/hooks/useAuthInit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});

// App은 라우팅만 하는 역할
function AppRoutes() {
  const element = useRoutes(routes);

  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

// 앱 초기화 + 라우팅
function AppContent() {
  // 🎯 앱 초기화 (Access Token 복구)
  const { isInitialized } = useAuthInit();

  // 초기화 전에는 로딩 표시
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

  // 초기화 완료 후 라우팅
  return (
    <>
      <AppRoutes />
      <LoginModal />
    </>
  );
}

// 앱 전체에 필요한 providers 집합
export function Providers() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
