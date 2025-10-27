import { api } from '@/shared/utils/axios';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from '../types/auth';

/** auth 관련 api 호출함수를 객체로 담은 함수 */
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // 회원가입 api
  signup: async (signupFormData: SignupRequest): Promise<SignupResponse> => {
    const { data } = await api.post('/auth/signup', signupFormData);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
    return data;
  },
};
