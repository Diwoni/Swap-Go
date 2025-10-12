import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ROUTE_PATH } from './path';
import PageLayout from '@/shared/ui/PageLayout';
import SignupPage from '@/pages/SignupPage';

const HomePage = lazy(() => import('@/pages/HomePage'));

export const routes: RouteObject[] = [
  {
    element: <PageLayout />,
    children: [
      { path: ROUTE_PATH.HOME, element: <HomePage /> },
      { path: ROUTE_PATH.SIGNUP, element: <SignupPage /> },
    ],
  },
];
