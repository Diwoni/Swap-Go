class TokenManager {
  private accessToken: string | null = null;

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  hasAccessToken(): boolean {
    return this.accessToken != null;
  }

  debugToken(): void {
    if (import.meta.env.DEV) {
      console.log('Access Token : ', this.accessToken);
    }
  }
}

// 싱글톤 패턴
export const tokenManager = new TokenManager();
