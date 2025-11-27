// src/shared/utils/errorHandler.ts
import { AxiosError } from 'axios';

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export function handleAPIError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError | undefined;
    const statusCode = error.response?.status;

    // 네트워크 에러
    if (!error.response) {
      return '네트워크 연결을 확인해주세요.';
    }

    // 상태 코드별 처리
    switch (statusCode) {
      case 401:
        return apiError?.message ?? '로그인이 필요합니다.';
      case 403:
        return apiError?.message ?? '접근 권한이 없습니다.';
      case 404:
        return apiError?.message ?? '요청한 리소스를 찾을 수 없습니다.';
      case 422:
        return apiError?.message ?? '입력값을 확인해주세요.';
      case 500:
      default:
        return apiError?.message ?? '서버 오류가 발생했습니다.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}
