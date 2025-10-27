export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: BASE_URL,
  TIMEOUT: 10000,
  RETRY_COUNT: 2,
} as const;

export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15분
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7일
} as const;

export const ERROR_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
