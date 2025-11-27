import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { tokenManager } from '@/shared/libs/auth/tokenManager';

import { authService } from '../api';

// 앱 초기화 시 인증 복구
// 새로고침 시 Refresh Token으로 Access Token 재발급
export const useAuthInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 자동 로그인 시도...');

        const { accessToken } = await authService.refreshToken();

        if (!accessToken) {
          throw new Error('Access Token이 없습니다.');
        }

        tokenManager.setAccessToken(accessToken);
        console.log('✅ 자동 로그인 성공');
      } catch (error) {
        console.log('❌ 자동 로그인 실패 (로그아웃 상태)');
        console.error(error);
        tokenManager.clearAccessToken();
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();

    // 인증 만료 이벤트 리스너
    const handleAuthExpired = () => {
      console.log('🔒 인증 만료');
      queryClient.clear();
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [queryClient]);

  return { isInitialized };
};
