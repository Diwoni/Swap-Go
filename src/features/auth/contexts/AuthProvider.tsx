import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';

import { tokenManager } from '@/shared/libs/auth/tokenManager';

import { authService } from '../api/auth.api';
import { AuthContextValue } from '../types';
import { AuthContext } from './auth.context';

/** 컨텍스트로 제공할 함수 및 데이터들 정의 (Provider) */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  /** 사용자 정보 조회 api 쿼리 */
  const { data: user = null, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getMe,
    enabled: isInitialized && tokenManager.hasAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken } = await authService.refreshToken();
        tokenManager.setAccessToken(accessToken);
      } catch {
        tokenManager.clearAccessToken();
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  if (!isInitialized) {
    return null; // Loading spinner 사용하기
  }

  const value: AuthContextValue = {
    user: user,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
