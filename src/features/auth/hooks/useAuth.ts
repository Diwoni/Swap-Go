import { useQuery } from '@tanstack/react-query';

import { tokenManager } from '@/shared/libs/auth/tokenManager';

import { authService } from '../api';
import { User } from '../types';

export const useAuth = () => {
  const { data: user = null, isLoading } = useQuery<User>({
    queryKey: ['auth', 'user'],
    queryFn: authService.getMe,
    enabled: tokenManager.hasAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
