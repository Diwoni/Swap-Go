import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { mypageApi } from '../api/mypage.api';
import { mypageKeys } from '../queryKeys';
import { DeleteAccountRequest, UpdateProfileRequest } from '../types/mypage.types';

export const useMyProfile = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: mypageKeys.profile(),
    queryFn: mypageApi.getProfile,
    throwOnError: true,
  });

  return { profile, isLoading };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => mypageApi.updateProfile(data),
    onSuccess: () => {
      toast.success('프로필이 수정되었습니다.');
      void queryClient.invalidateQueries({ queryKey: mypageKeys.profile() });
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => mypageApi.deleteAccount(data),
    onSuccess: () => {
      toast.success('회원 탈퇴가 완료되었습니다.');
    },
  });
};
