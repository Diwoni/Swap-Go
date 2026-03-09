import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTE_PATH } from '@/app/router/path';
import { useAuth } from '@/features/auth/hooks';
import { useModalContext } from '@/shared/hooks';

type ProtectedRouteProps = {
  redirectPath?: string;
};

export const ProtectedRoute = ({ redirectPath = ROUTE_PATH.HOME }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { loginModal } = useModalContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.', {
        id: 'protected-route-auth-required',
      });
      loginModal.openModal();
    }
  }, [isAuthenticated, isLoading, loginModal]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
