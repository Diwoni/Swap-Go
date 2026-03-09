// src/mocks/handlers/auth.handlers.ts

import { http, HttpResponse } from 'msw';

import type { LoginRequest, LoginResponse, SignupRequest, User } from '@/features/auth/types/auth';

import { API_CONFIG } from '../shared/libs/constants';

// ==================== 설정 ====================
const BASE_URL = API_CONFIG.BASE_URL;
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15분
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일
const EMAIL_CODE_EXPIRY = 5 * 60 * 1000; // 5분

// ==================== 타입 정의 ====================
export type StoredUser = {
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

interface VerificationCode {
  verificationCode: string;
  email: string;
  expiresAt: number;
  isVerified: boolean;
}

// ==================== 메모리 DB ====================
export const users = new Map<string, StoredUser>();
export const refreshTokens = new Map<string, TokenPayload>();
export const verificationCodes = new Map<string, VerificationCode>();

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

// ==================== 유틸리티 함수 ====================

/**
 * 6자리 랜덤 인증 코드 생성
 */
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * 쿠키에서 리프레시 토큰 추출
 */
const extractRefreshToken = (cookieHeader: string | null): string | null => {
  if (!cookieHeader) return null;
  const match = /refreshToken=([^;]+)/.exec(cookieHeader);
  return match?.[1] ?? null;
};

/**
 * 인증 코드 만료 체크
 */
const isCodeExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt;
};

/**
 * User 객체 생성 (password 제외)
 */
export const createUserResponse = (storedUser: StoredUser): User => {
  return {
    email: storedUser.email,
    username: storedUser.username,
    address: storedUser.address,
  };
};

export const getUserFromAuthHeader = (authHeader: string | null): StoredUser | null => {
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return users.get(payload.email) ?? null;
};

/**
 * 이메일 형식 검증
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ==================== MSW 핸들러 ====================
export const authHandlers = [
  // ==================== 이메일 인증 ====================

  /**
   * 이메일 인증 코드 발송
   * POST /api/auth/email
   */
  http.post(`${BASE_URL}/auth/email`, async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = (await request.json()) as { email: string };
    const { email } = body;

    // 1. 유효성 검사
    if (!email) {
      return HttpResponse.json({ message: '이메일을 입력해주세요.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return HttpResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
    }

    // 2. 이메일 중복 체크 (users Map 기반)
    if (users.has(email)) {
      return HttpResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 400 });
    }

    // 3. 인증 코드 생성
    const verificationCode = generateVerificationCode();
    const expiresAt = Date.now() + EMAIL_CODE_EXPIRY;

    verificationCodes.set(email, {
      verificationCode,
      email,
      expiresAt,
      isVerified: false,
    });

    console.log(
      `📧 [MSW] 인증 코드 발송: ${email} → ${verificationCode} (만료: ${new Date(expiresAt).toLocaleTimeString()})`
    );

    return HttpResponse.json(
      {
        message: '인증 메일이 발송되었습니다.',
        expireIn: 300, // 초 단위
      },
      { status: 200 }
    );
  }),

  /**
   * 이메일 인증 코드 확인
   * POST /api/auth/email-confirm
   */
  http.post(`${BASE_URL}/auth/email-confirm`, async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const body = (await request.json()) as { email: string; verificationCode: string };
    const { email, verificationCode } = body;

    // 1. 유효성 검사
    if (!email || !verificationCode) {
      return HttpResponse.json({ message: '이메일과 인증번호를 입력해주세요.' }, { status: 400 });
    }

    // 2. 저장된 인증 코드 확인
    const storedCode = verificationCodes.get(email);
    if (!storedCode) {
      return HttpResponse.json({ message: '인증번호를 먼저 발송해주세요.' }, { status: 400 });
    }

    // 3. 만료 시간 체크
    if (isCodeExpired(storedCode.expiresAt)) {
      verificationCodes.delete(email);
      return HttpResponse.json(
        { message: '인증번호가 만료되었습니다. 재발송해주세요.' },
        { status: 400 }
      );
    }

    // 4. 인증 코드 일치 확인
    if (storedCode.verificationCode !== verificationCode) {
      return HttpResponse.json({ message: '인증번호가 일치하지 않습니다.' }, { status: 400 });
    }

    // 5. 인증 완료 처리
    storedCode.isVerified = true;
    verificationCodes.set(email, storedCode);

    console.log(`✅ [MSW] 이메일 인증 완료: ${email}`);

    const verificationToken = `verified_${email}_${Date.now()}`;

    return HttpResponse.json(
      {
        message: '이메일 인증이 완료되었습니다.',
        isVerified: true,
        verificationToken,
      },
      { status: 200 }
    );
  }),

  // ==================== 회원가입/로그인 ====================

  /**
   * 회원가입
   * POST /auth/signup
   */
  http.post<never, SignupRequest>(`${BASE_URL}/auth/signup`, async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();
    const { email, password, username, address } = body;

    // 1. 필수 항목 검사
    if (!email || !password || !username) {
      return HttpResponse.json({ message: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    // 2. 이메일 형식 검증
    if (!isValidEmail(email)) {
      return HttpResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
    }

    // 3. 이메일 중복 체크
    if (users.has(email)) {
      return HttpResponse.json({ message: '이미 사용 중인 이메일입니다.' }, { status: 409 });
    }

    // 4. 이메일 인증 여부 확인 (필수)
    const storedCode = verificationCodes.get(email);
    if (!storedCode?.isVerified) {
      return HttpResponse.json({ message: '이메일 인증을 완료해주세요.' }, { status: 400 });
    }

    // 5. 비밀번호 길이 검증
    if (password.length < 8) {
      return HttpResponse.json({ message: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 });
    }

    // 6. 사용자 생성
    const newUser: StoredUser = {
      email,
      password,
      username,
      address: address || {
        country: 'South Korea',
        region: 'Seoul',
      },
    };
    users.set(email, newUser);

    // 7. 인증 코드 삭제 (회원가입 완료 후)
    verificationCodes.delete(email);

    console.log(`🎉 [MSW] 회원가입 성공: ${email} (${username})`);

    // 8. 응답 (토큰 없이 message만)
    return HttpResponse.json({ message: '회원가입이 성공적으로 완료되었습니다.' }, { status: 200 });
  }),

  /**
   * 로그인
   * POST /auth/login
   */
  http.post<never, LoginRequest>(`${BASE_URL}/auth/login`, async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();
    const { email, password } = body;

    // 1. 필수 항목 검사
    if (!email || !password) {
      return HttpResponse.json({ message: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 2. 사용자 확인
    const user = users.get(email);
    if (user?.password !== password) {
      return HttpResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 3. 토큰 생성
    const accessToken = generateToken(email, ACCESS_TOKEN_EXPIRY);
    const refreshToken = generateToken(email, REFRESH_TOKEN_EXPIRY);

    const refreshPayload = verifyToken(refreshToken);
    if (refreshPayload) {
      refreshTokens.set(refreshToken, refreshPayload);
    }

    console.log(`✅ [MSW] 로그인 성공: ${email}`);

    // 4. 응답
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
  }),

  /**
   * 로그아웃
   * POST /auth/logout
   */
  http.post(`${BASE_URL}/auth/logout`, ({ request }) => {
    const cookieHeader = request.headers.get('cookie');
    const refreshToken = extractRefreshToken(cookieHeader);

    if (refreshToken) {
      refreshTokens.delete(refreshToken);
      console.log('✅ [MSW] 로그아웃 성공');
    }

    return HttpResponse.json(
      { message: '로그아웃되었습니다.' },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
        },
      }
    );
  }),

  /**
   * 토큰 갱신
   * POST /auth/refresh
   */
  http.post(`${BASE_URL}/auth/refresh`, ({ request }) => {
    const cookieHeader = request.headers.get('cookie');
    const refreshToken = extractRefreshToken(cookieHeader);

    if (!refreshToken) {
      return HttpResponse.json({ message: '리프레시 토큰이 없습니다.' }, { status: 401 });
    }

    const payload = verifyToken(refreshToken);
    if (!payload || !refreshTokens.has(refreshToken)) {
      return HttpResponse.json({ message: '유효하지 않은 리프레시 토큰입니다.' }, { status: 401 });
    }

    const newAccessToken = generateToken(payload.email, ACCESS_TOKEN_EXPIRY);

    console.log(`🔄 [MSW] 토큰 갱신 성공: ${payload.email}`);

    return HttpResponse.json(
      {
        accessToken: newAccessToken,
        refreshToken: null,
      },
      { status: 200 }
    );
  }),

  /**
   * 사용자 정보 조회 (인증 필요)
   * GET /users/me
   */
  http.get(`${BASE_URL}/users/me`, ({ request }) => {
    const user = getUserFromAuthHeader(request.headers.get('authorization'));

    if (!user) {
      console.error('❌ [MSW /users/me] 토큰 없음');
      return HttpResponse.json({ message: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    console.log(`✅ [MSW /users/me] 사용자 정보 조회 성공: ${user.email}`);
    return HttpResponse.json(createUserResponse(user), { status: 200 });
  }),
];

// ==================== 개발자 도구 (선택사항) ====================

export const mswDevtools = {
  /**
   * 모든 인증 코드 조회
   */
  showAllCodes: () => {
    console.table(
      Array.from(verificationCodes.entries()).map(([email, data]) => ({
        email,
        code: data.verificationCode,
        expiresAt: new Date(data.expiresAt).toLocaleTimeString(),
        isVerified: data.isVerified,
        expired: isCodeExpired(data.expiresAt),
      }))
    );
  },

  /**
   * 특정 이메일의 인증 코드 조회
   */
  getCode: (email: string) => {
    const code = verificationCodes.get(email);
    if (!code) {
      console.log(`❌ ${email}: 인증 코드 없음`);
      return null;
    }
    console.log(
      `📧 ${email}: ${code.verificationCode} (만료: ${isCodeExpired(code.expiresAt) ? 'YES' : 'NO'})`
    );
    return code.verificationCode;
  },

  /**
   * 모든 사용자 조회
   */
  showAllUsers: () => {
    console.table(
      Array.from(users.entries()).map(([email, user]) => ({
        email,
        username: user.username,
        address: `${user.address.region}, ${user.address.country}`,
      }))
    );
  },

  /**
   * 인증 코드 강제 설정
   */
  setCode: (email: string, verificationCode: string) => {
    verificationCodes.set(email, {
      verificationCode,
      email,
      expiresAt: Date.now() + EMAIL_CODE_EXPIRY,
      isVerified: false,
    });
    console.log(`✅ 인증 코드 설정: ${email} → ${verificationCode}`);
  },

  /**
   * 모든 데이터 초기화
   */
  clearAll: () => {
    verificationCodes.clear();
    refreshTokens.clear();
    // 테스트 유저는 유지
    const testUser = users.get('test@example.com');
    users.clear();
    if (testUser) {
      users.set('test@example.com', testUser);
    }
    console.log('🗑️ 모든 데이터 초기화 (테스트 유저 제외)');
  },
};
