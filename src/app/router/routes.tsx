import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ROUTE_PATH } from './path';

const HomePage = lazy(() => import('@/pages/HomePage'));

export const routes: RouteObject[] = [
  {
    path: ROUTE_PATH.HOME,
    element: <HomePage />,
  },
];
