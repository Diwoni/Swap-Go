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

export const CATEGORY_LIST = [
  { id: 'electronics', name: '전자기기', icon: '💻', desc: '폰, 태블릿, PC, 카메라' },
  { id: 'furniture', name: '가구', icon: '🛋️', desc: '침대, 소파, 책상, 의자' },
  { id: 'kitchen', name: '주방용품', icon: '🍳', desc: '그릇, 냄비, 조리도구' },
  { id: 'instruments', name: '악기', icon: '🎸', desc: '기타, 피아노, 관악기' },
  { id: 'men-clothing', name: '남성의류', icon: '👔', desc: '셔츠, 바지, 자켓, 정장' },
  { id: 'women-clothing', name: '여성의류', icon: '👗', desc: '원피스, 블라우스, 치마' },
  { id: 'sports', name: '스포츠', icon: '⚽', desc: '축구, 야구, 헬스, 캠핑' },
  { id: 'beauty', name: '미용', icon: '💄', desc: '화장품, 향수, 이미용' },
  { id: 'food', name: '식품', icon: '🍎', desc: '가공식품, 농수산물' },
  { id: 'tickets', name: '티켓', icon: '🎫', desc: '공연, 전시, 관람권' },
  { id: 'vouchers', name: '상품권', icon: '💳', desc: '백화점, 문화상품권' },
  { id: 'others', name: '기타', icon: '📦', desc: '도서, 문구, 잡화, 취미' },
] as const;

// 타입 추출 (필요 시 사용)
export type CategoryType = (typeof CATEGORY_LIST)[number]['name'];
