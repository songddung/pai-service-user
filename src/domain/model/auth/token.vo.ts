/**
 * 토큰 Value Object
 * 불변 객체로 토큰 쌍을 표현
 */
export class TokenPair {
  private constructor(
    private readonly accessToken: string,
    private readonly refreshToken: string,
  ) {
    if (!accessToken || !refreshToken) {
      throw new Error('토큰은 필수값입니다.');
    }
  }

  static create(accessToken: string, refreshToken: string): TokenPair {
    return new TokenPair(accessToken, refreshToken);
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  // 객체를 일반 형식으로 변환
  toPlainObject(): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }
}
