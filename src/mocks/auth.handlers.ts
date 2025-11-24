// 리프레시 토큰 현재 사용 불가
import { http, HttpResponse } from 'msw';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from '@/features/auth/types/auth';

// ==================== 설정 ====================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15분
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일

// ==================== 타입 정의 ====================
type StoredUser = {
  email: string;
  password: string;
  username: string;
  address: {
    country: string;
    region: string;
    street?: string;
  };
};

type TokenPayload = {
  email: string;
  iat: number;
  exp: number;
};

// ==================== 메모리 DB ====================
// export for testing utilities
export const users = new Map<string, StoredUser>();
export const refreshTokens = new Map<string, TokenPayload>();

// 테스트용 초기 사용자
users.set('test@example.com', {
  email: 'test@example.com',
  password: 'password123',
  username: '테스트유저',
  address: {
    country: 'South Korea',
    region: 'Seoul',
    street: '123 Test Street',
  },
});

// ==================== 토큰 유틸리티 ====================
/**
 * 간단한 JWT 시뮬레이션 (Base64 인코딩)
 */
const generateToken = (email: string, expiresIn: number): string => {
  const payload: TokenPayload = {
    email,
    iat: Date.now(),
    exp: Date.now() + expiresIn,
  };
  return btoa(JSON.stringify(payload));
};

/**
 * 토큰 검증 및 디코딩
 */
const verifyToken = (token: string): TokenPayload | null => {
  try {
    const payload = JSON.parse(atob(token)) as TokenPayload;
    if (payload.exp < Date.now()) {
      return null; // 만료된 토큰
    }
    return payload;
  } catch {
    return null; // 잘못된 토큰
  }
};

/**
 * Authorization 헤더에서 토큰 추출
 */
const extractTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * 쿠키에서 리프레시 토큰 추출
 */
const extractRefreshToken = (cookieHeader: string | null): string | null => {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/refreshToken=([^;]+)/);
  return match ? match[1] : null;
};

/**
 * User 객체 생성 (password 제외)
 */
const createUserResponse = (storedUser: StoredUser): User => {
  return {
    email: storedUser.email,
    username: storedUser.username,
    address: storedUser.address,
  };
};

// ==================== MSW 핸들러 ====================
export const authHandlers = [
  /**
   * 회원가입
   */
  http.post<never, SignupRequest>(
    `${BASE_URL}/auth/signup`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password, username } = body;

      // 유효성 검사
      if (!email || !password || !username) {
        return HttpResponse.json(
          { message: '필수 항목을 모두 입력해주세요.' },
          { status: 400 }
        );
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return HttpResponse.json(
          { message: '올바른 이메일 형식이 아닙니다.' },
          { status: 400 }
        );
      }

      // 이메일 중복 체크 (주석 처리 - 나중에 구현)
      // if (users.has(email)) {
      //   return HttpResponse.json(
      //     { message: '이미 사용 중인 이메일입니다.' },
      //     { status: 409 }
      //   );
      // }

      // 사용자 생성
      const newUser: StoredUser = {
        email,
        password,
        username,
        address: {
          country: 'South Korea',
          region: 'Seoul',
        },
      };
      users.set(email, newUser);

      // 토큰 생성
      const accessToken = generateToken(email, ACCESS_TOKEN_EXPIRY);
      const refreshToken = generateToken(email, REFRESH_TOKEN_EXPIRY);

      // 리프레시 토큰 저장
      const refreshPayload = verifyToken(refreshToken);
      if (refreshPayload) {
        refreshTokens.set(refreshToken, refreshPayload);
      }

      // 응답
      const response: SignupResponse = {
        accessToken,
        user: createUserResponse(newUser),
      };

      return HttpResponse.json(response, {
        status: 201,
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${REFRESH_TOKEN_EXPIRY / 1000}; Path=/`,
        },
      });
    }
  ),

  /**
   * 로그인
   */
  http.post<never, LoginRequest>(
    `${BASE_URL}/auth/login`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password } = body;

      // 유효성 검사
      if (!email || !password) {
        return HttpResponse.json(
          { message: '이메일과 비밀번호를 입력해주세요.' },
          { status: 400 }
        );
      }

      // 사용자 확인
      const user = users.get(email);
      if (!user || user.password !== password) {
        return HttpResponse.json(
          { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
          { status: 401 }
        );
      }

      // 토큰 생성
      const accessToken = generateToken(email, ACCESS_TOKEN_EXPIRY);
      const refreshToken = generateToken(email, REFRESH_TOKEN_EXPIRY);

      // 리프레시 토큰 저장
      const refreshPayload = verifyToken(refreshToken);
      if (refreshPayload) {
        refreshTokens.set(refreshToken, refreshPayload);
      }

      // 응답
      const response: LoginResponse = {
        accessToken,
        user: createUserResponse(user),
      };

      return HttpResponse.json(response, {
        status: 200,
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${REFRESH_TOKEN_EXPIRY / 1000}; Path=/`,
        },
      });
    }
  ),

  /**
   * 로그아웃
   */
  http.post(`${BASE_URL}/auth/logout`, ({ request }) => {
    const cookieHeader = request.headers.get('cookie');
    const refreshToken = extractRefreshToken(cookieHeader);

    // 리프레시 토큰 삭제
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    return HttpResponse.json(
      { message: '로그아웃되었습니다.' },
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
        },
      }
    );
  }),

  /**
   * 토큰 갱신
   */
  http.post(`${BASE_URL}/auth/refresh`, ({ request }) => {
    const cookieHeader = request.headers.get('cookie');
    const refreshToken = extractRefreshToken(cookieHeader);

    if (!refreshToken) {
      return HttpResponse.json(
        { message: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // 리프레시 토큰 검증
    const payload = verifyToken(refreshToken);
    if (!payload || !refreshTokens.has(refreshToken)) {
      return HttpResponse.json(
        { message: '유효하지 않은 리프레시 토큰입니다.' },
        { status: 401 }
      );
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = generateToken(payload.email, ACCESS_TOKEN_EXPIRY);

    return HttpResponse.json(
      {
        accessToken: newAccessToken,
        refreshToken: null, // 쿠키로 관리하므로 null
      },
      { status: 200 }
    );
  }),

  /**
   * 사용자 정보 조회 (인증 필요)
   */
  http.get(`${BASE_URL}/users/me`, ({ request }) => {
    const authHeader = request.headers.get('authorization');
    console.log('🔍 [MSW /users/me] Authorization 헤더:', authHeader);

    const token = extractTokenFromHeader(authHeader);
    console.log('🔍 [MSW /users/me] 추출된 토큰:', token);

    if (!token) {
      console.error('❌ [MSW /users/me] 토큰 없음!');
      return HttpResponse.json(
        { message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    console.log('🔍 [MSW /users/me] 토큰 검증 결과:', payload);

    if (!payload) {
      console.error('❌ [MSW /users/me] 토큰 검증 실패!');
      return HttpResponse.json(
        { message: '유효하지 않거나 만료된 토큰입니다.' },
        { status: 401 }
      );
    }

    const user = users.get(payload.email);
    console.log('🔍 [MSW /users/me] 사용자 조회:', user ? '성공' : '실패');

    if (!user) {
      console.error('❌ [MSW /users/me] 사용자 없음! email:', payload.email);
      console.log('📋 [MSW] 현재 등록된 사용자들:', Array.from(users.keys()));
      return HttpResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('✅ [MSW /users/me] 성공!');
    return HttpResponse.json(createUserResponse(user), { status: 200 });
  }),
];
