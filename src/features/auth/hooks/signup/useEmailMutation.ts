import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { handleAPIError } from '@/shared/utils/errorHandler';

import { sendEmailVerificationCode, verifyEmailCode } from '../../api/email.api';
import {
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeRepuest,
  VerifyEmailCodeResponse,
} from '../../types';

export const useSendEmailCodeMutation = () => {
  return useMutation({
    mutationFn: (data: SendEmailCodeRequest) => sendEmailVerificationCode(data),
    onSuccess: (data: SendEmailCodeResponse) => {
      // TODO : 모달 '이메일을 확인해주세요.'
      // TODO : data.expiretime 저장
      console.log(data.message);
    },
    onError: (error: AxiosError) => {
      handleAPIError(error);
    },
  });
};

export const useVerifyEmailCode = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailCodeRepuest) => verifyEmailCode(data),
    onSuccess: (data: VerifyEmailCodeResponse) => {
      console.log(data.message + data.verificationToken);
    },
    onError: (error: AxiosError) => {
      handleAPIError(error);
    },
  });
};
