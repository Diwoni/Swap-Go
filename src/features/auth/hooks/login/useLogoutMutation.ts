import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../api/auth.api';
import { tokenManager } from '@/shared/libs/auth/tokenManager';
import { handleAPIError } from '@/shared/utils/errorHandler';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      tokenManager.clearAccessToken();
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
    },
    onError: (error) => {
      const message = handleAPIError(error);
      console.error('로그아웃에 실패하였습니다 : ', message);
    },
  });
};
