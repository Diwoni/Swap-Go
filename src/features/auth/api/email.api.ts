import { api } from '@/shared/utils/axios';
import {
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeRepuest,
  VerifyEmailCodeResponse,
} from '../types';

export const sendEmailVerificationCode = async (data: SendEmailCodeRequest) => {
  const response = await api.post<SendEmailCodeResponse>('/auth/email', data);
  return response.data;
};

export const verifyEmailCode = async (data: VerifyEmailCodeRepuest) => {
  const response = await api.post<VerifyEmailCodeResponse>(
    '/auth/email-confirm',
    data
  );
  return response.data;
};
