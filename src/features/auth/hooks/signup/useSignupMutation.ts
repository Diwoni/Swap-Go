import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { authService } from '../../api';
import { SignupResponse } from '../../types';

export const useSignupMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data: SignupResponse) => {
      toast.success(data?.message ?? '회원가입이 완료되었습니다.');
      navigate('/');
    },
    onError: (err: AxiosError) => {
      toast.error(err?.message ?? '회원가입에 실패하였습니다.');
    },
  });
};
