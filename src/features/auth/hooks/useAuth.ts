import { useQuery } from '@tanstack/react-query';
import { authService } from '../api';
import { tokenManager } from '@/shared/libs/auth/tokenManager';
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
