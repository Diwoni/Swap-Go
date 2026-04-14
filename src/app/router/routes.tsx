import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { MyPage } from '@/pages';
import ChatPage from '@/pages/ChatPage';
import SignupPage from '@/pages/SignupPage';
import { ProtectedRoute } from '@/shared/router/ProtectedRoute';
import { ErrorBoundary, QueryErrorBoundary } from '@/shared/ui';
import PageLayout from '@/shared/ui/PageLayout';

import ListingCreatePage from '../../pages/ListingCreatePage';
import ProductDetailPage from '../../pages/ProductDetailPage';
import RentalPage from '../../pages/RentalPage';
import ResalePage from '../../pages/ResalePage';
import { ROUTE_PATH } from './path';

const HomePage = lazy(() => import('@/pages/HomePage'));

export const routes: RouteObject[] = [
  {
    element: <PageLayout />,
    children: [
      { path: ROUTE_PATH.HOME, element: <HomePage /> },
      {
        path: ROUTE_PATH.SIGNUP,
        element: (
          <ErrorBoundary>
            <SignupPage />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTE_PATH.RESALE,
        element: (
          <ErrorBoundary>
            <ResalePage />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTE_PATH.RENTAL,
        element: (
          <ErrorBoundary>
            <RentalPage />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTE_PATH.PRODUCT_DETAIL,
        element: (
          <QueryErrorBoundary>
            <ProductDetailPage />
          </QueryErrorBoundary>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTE_PATH.CHAT,
            element: (
              <ErrorBoundary>
                <ChatPage />
              </ErrorBoundary>
            ),
          },
          {
            path: ROUTE_PATH.LISTING_NEW,
            element: (
              <ErrorBoundary>
                <ListingCreatePage />
              </ErrorBoundary>
            ),
          },
          {
            path: ROUTE_PATH.MYPAGE,
            element: (
              <QueryErrorBoundary>
                <MyPage />
              </QueryErrorBoundary>
            ),
          },
        ],
      },
    ],
  },
];
