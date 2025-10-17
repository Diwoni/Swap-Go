class TokenManager {
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  hasAccessToken(): boolean {
    return this.accessToken !== null && this.accessToken.length > 0;
  }

  debugToken(): void {
    if (import.meta.env.DEV) {
      console.log('Access Token : ', this.accessToken);
    }
  }
}

// 싱글톤 패턴
export const tokenManager = new TokenManager();
