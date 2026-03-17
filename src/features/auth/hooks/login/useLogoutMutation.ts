import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenManager } from '@/shared/libs/auth/tokenManager';
import { handleAPIError } from '@/shared/utils/errorHandler';

import { productKeys } from '../../../product/queryKeys';
import { authService } from '../../api/auth.api';
import { authKeys } from '../../queryKeys';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      tokenManager.clearAccessToken();
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: productKeys.all });
      queryClient.removeQueries({ queryKey: productKeys.details() });
    },
    onError: (error) => {
      const message = handleAPIError(error);
      console.error('로그아웃에 실패하였습니다 : ', message);
    },
  });
};
