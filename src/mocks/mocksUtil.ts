/**
 * MSW Mock Server 테스트 및 디버깅 유틸리티
 *
 * 개발 중 콘솔에서 직접 호출하여 사용할 수 있습니다.
 * 예: window.mockUtils.addTestUser({ ... })
 */

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

// Note: 실제 핸들러에서 사용하는 users, refreshTokens Map을 외부에서 접근 가능하도록 export 필요
// 이 파일은 핸들러 파일과 같은 users, refreshTokens를 공유해야 합니다.

export class MockServerUtils {
  private users: Map<string, StoredUser>;
  private refreshTokens: Map<string, any>;

  constructor(users: Map<string, StoredUser>, refreshTokens: Map<string, any>) {
    this.users = users;
    this.refreshTokens = refreshTokens;
  }

  /**
   * 테스트용 사용자 추가
   */
  addTestUser(
    user: Omit<StoredUser, 'address'> & {
      address?: Partial<StoredUser['address']>;
    }
  ): void {
    const fullUser: StoredUser = {
      email: user.email,
      password: user.password,
      username: user.username,
      address: {
        country: user.address?.country || 'South Korea',
        region: user.address?.region || 'Seoul',
        street: user.address?.street,
      },
    };
    this.users.set(user.email, fullUser);
    console.log('✅ 테스트 사용자 추가:', user.email);
  }

  /**
   * 모든 사용자 조회
   */
  getAllUsers(): StoredUser[] {
    return Array.from(this.users.values());
  }

  /**
   * 특정 사용자 조회
   */
  getUser(email: string): StoredUser | undefined {
    return this.users.get(email);
  }

  /**
   * 사용자 삭제
   */
  deleteUser(email: string): boolean {
    const deleted = this.users.delete(email);
    if (deleted) {
      console.log('🗑️ 사용자 삭제:', email);
    }
    return deleted;
  }

  /**
   * 모든 사용자 삭제 (초기 테스트 사용자 제외)
   */
  clearUsers(keepTestUser = true): void {
    if (keepTestUser) {
      const testUser = this.users.get('test@example.com');
      this.users.clear();
      if (testUser) {
        this.users.set('test@example.com', testUser);
      }
    } else {
      this.users.clear();
    }
    console.log('🧹 사용자 데이터 초기화');
  }

  /**
   * 모든 리프레시 토큰 무효화 (강제 로그아웃)
   */
  clearRefreshTokens(): void {
    this.refreshTokens.clear();
    console.log('🔒 모든 리프레시 토큰 무효화');
  }

  /**
   * 사용자 비밀번호 변경
   */
  changePassword(email: string, newPassword: string): boolean {
    const user = this.users.get(email);
    if (user) {
      user.password = newPassword;
      console.log('🔑 비밀번호 변경:', email);
      return true;
    }
    return false;
  }

  /**
   * Mock 서버 상태 출력
   */
  getServerStatus(): void {
    console.log('📊 Mock Server 상태:');
    console.log('- 등록된 사용자 수:', this.users.size);
    console.log('- 활성 리프레시 토큰 수:', this.refreshTokens.size);
    console.log('\n👥 등록된 사용자 목록:');
    this.users.forEach((user, email) => {
      console.log(`  - ${email} (${user.username})`);
    });
  }

  /**
   * 대량의 테스트 사용자 생성
   */
  seedUsers(count: number): void {
    for (let i = 1; i <= count; i++) {
      this.addTestUser({
        email: `user${i}@example.com`,
        password: 'password123',
        username: `테스트유저${i}`,
      });
    }
    console.log(`✅ ${count}명의 테스트 사용자 생성 완료`);
  }

  /**
   * 특정 이메일이 등록되어 있는지 확인
   */
  isEmailRegistered(email: string): boolean {
    return this.users.has(email);
  }

  /**
   * 사용자 정보 업데이트
   */
  updateUser(
    email: string,
    updates: Partial<Omit<StoredUser, 'email'>>
  ): boolean {
    const user = this.users.get(email);
    if (!user) return false;

    if (updates.password) user.password = updates.password;
    if (updates.username) user.username = updates.username;
    if (updates.address) {
      user.address = { ...user.address, ...updates.address };
    }

    console.log('✏️ 사용자 정보 업데이트:', email);
    return true;
  }
}

// 개발 환경에서 window 객체에 유틸리티 노출
export const exposeUtilsToWindow = (
  users: Map<string, StoredUser>,
  refreshTokens: Map<string, any>
): void => {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const utils = new MockServerUtils(users, refreshTokens);
    (window as any).mockUtils = utils;

    console.log(
      '%c🔧 Mock Server Utils',
      'color: #4CAF50; font-size: 14px; font-weight: bold;'
    );
    console.log('콘솔에서 mockUtils를 사용할 수 있습니다:');
    console.log('- mockUtils.getServerStatus()    // 서버 상태 확인');
    console.log('- mockUtils.addTestUser({...})   // 테스트 사용자 추가');
    console.log('- mockUtils.getAllUsers()        // 모든 사용자 조회');
    console.log('- mockUtils.clearRefreshTokens() // 모든 토큰 무효화');
    console.log(
      '- mockUtils.seedUsers(10)        // 10명의 테스트 사용자 생성'
    );
  }
};

// TypeScript를 위한 Window 인터페이스 확장
declare global {
  interface Window {
    mockUtils?: MockServerUtils;
  }
}
