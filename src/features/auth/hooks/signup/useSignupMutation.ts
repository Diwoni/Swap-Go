import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenManager } from '@/shared/libs/auth/tokenManager';

import { authService } from '../../api';
import { SignupResponse } from '../../types';

export const useSignupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data: SignupResponse) => {
      tokenManager.setAccessToken(data.accessToken);
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
};
