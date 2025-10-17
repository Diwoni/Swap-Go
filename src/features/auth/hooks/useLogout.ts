import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { tokenManager } from '@/shared/libs/auth/tokenManager';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      tokenManager.clearAccessToken();
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
    },
  });
};
