import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import SignupPage from '@/pages/SignupPage';
import PageLayout from '@/shared/ui/PageLayout';

import { ROUTE_PATH } from './path';

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
