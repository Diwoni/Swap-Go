import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { tokenManager } from '@/shared/libs/auth/tokenManager';

import { handleAPIError } from '../../../../shared/utils/errorHandler';
import { authService } from '../../api/auth.api';
import { authKeys } from '../../queryKeys';
import { LoginResponse } from '../../types/auth';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: LoginResponse) => {
      tokenManager.setAccessToken(data.accessToken);
      queryClient.setQueryData(authKeys.user(), data.user);
      toast.success('로그인에 성공하였습니다.');
    },
    onError: (error) => {
      toast.error(handleAPIError(error));
    },
  });
};
