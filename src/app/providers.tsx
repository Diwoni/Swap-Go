import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './router/routes';
import { Suspense } from 'react';

// App은 라우팅만 하는 역할
function AppRoutes() {
  const element = useRoutes(routes);

  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

// 앱 전체에 필요한 providers 집합 (queryClient, 컨텍스트 등)
export function Providers() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
