export const ROUTE_PATH = {
  HOME: '/',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  TRADE: '/resale',
  RENTAL: '/rental',
  PRODUCT_DETAIL: '/product/:id',
} as const;

// 동적 경로를 반환하는 함수
export const getProductDetailPath = (productId: string | number) => {
  return `/products/${productId}`;
};
