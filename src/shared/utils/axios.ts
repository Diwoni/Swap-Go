import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG, ERROR_STATUS } from '@/shared/libs/constants';
import { tokenManager } from '../libs/auth/tokenManager';

const createInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...config,
  });
  return instance;
};

export const api = createInstance();

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 파일 업로드 시 Content-Type 자동 설정
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 현재 토큰을 갱신 중인가?
type QueueItem = {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
const failedQueue: QueueItem[] = [];

const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue.length = 0;
};

type RefreshResponse = {
  refreshToken: string | null;
  accessToken: string | null;
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (
      error.response?.status === ERROR_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err: Error) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<RefreshResponse>(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (!data?.accessToken) {
          throw new Error('토큰 갱신 실패: 유효하지 않은 응답');
        }
        tokenManager.setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenManager.clearAccessToken();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error('토큰 갱신 중 알 수 없는 오류 발생')
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
