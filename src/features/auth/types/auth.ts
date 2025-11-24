// 사용자 정보
export type User = {
  email: string;
  username: string;
  address: Address;
};

// 주소
export type Address = {
  country: string;
  region: string;
  street?: string;
};

// 로그인 api 요청
export type LoginRequest = {
  email: string;
  password: string;
};

// 로그인 api 응답
export type LoginResponse = {
  accessToken: string;
  user: User;
};

// 회원가입 api 요청
export type SignupRequest = {
  email: string;
  password: string;
  username: string;
  // Todo : address
  // Todo : 이메일 인증토큰
};

// 회원가입 api 응답
export type SignupResponse = {
  accessToken: string;
  user: User;
};

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
