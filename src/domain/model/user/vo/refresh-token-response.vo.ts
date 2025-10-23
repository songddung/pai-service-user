export class RefreshTokenResponseVO {
  private constructor(
    private readonly accessToken: string,
    private readonly refreshToken: string,
  ) {
    if (!accessToken || !refreshToken) {
      throw new Error('토큰은 필수값입니다.');
    }
  }

  static create(
    accessToken: string,
    refreshToken: string,
  ): RefreshTokenResponseVO {
    return new RefreshTokenResponseVO(accessToken, refreshToken);
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  equals(other: RefreshTokenResponseVO): boolean {
    if (!other) return false;
    if (!(other instanceof RefreshTokenResponseVO)) return false;

    return (
      this.accessToken === other.accessToken &&
      this.refreshToken === other.refreshToken
    );
  }

  hashCode(): string {
    return `${this.accessToken}-${this.refreshToken}`;
  }
}
