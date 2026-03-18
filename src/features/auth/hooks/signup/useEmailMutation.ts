import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { sendEmailVerificationCode, verifyEmailCode } from '../../api/email.api';
import {
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
} from '../../types';

export const useSendEmailCodeMutation = () => {
  return useMutation({
    mutationFn: (data: SendEmailCodeRequest) => sendEmailVerificationCode(data),
    onSuccess: (data: SendEmailCodeResponse) => {
      toast.success(data?.message ?? '인증번호가 발송되었습니다.\n이메일을 확인해주세요.');
    },
  });
};

export const useVerifyEmailCode = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailCodeRequest) => verifyEmailCode(data),
    onSuccess: (data: VerifyEmailCodeResponse) => {
      toast.success(data?.message ?? '이메일 인증이 완료되었습니다.');
    },
  });
};
