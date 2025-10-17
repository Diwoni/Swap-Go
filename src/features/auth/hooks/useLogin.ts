import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { tokenManager } from '@/shared/libs/auth/tokenManager';
import { LoginResponse } from '../types/auth';
import { handleAPIError } from '@/shared/utils/errorHandler';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: LoginResponse) => {
      tokenManager.setAccessToken(data.accessToken);
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
    onError: (error) => {
      const message = handleAPIError(error);
      console.error('로그인에 실패하였습니다 :', message);
    },
  });
};
