export class SignupResponseVO {
  private constructor(
    private readonly userId: number,
    private readonly accessToken: string,
    private readonly refreshToken: string,
  ) {
    if (!userId || userId <= 0) {
      throw new Error('유효한 사용자 ID가 필요합니다.');
    }
    if (!accessToken || !refreshToken) {
      throw new Error('토큰은 필수값입니다.');
    }
  }

  static create(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): SignupResponseVO {
    return new SignupResponseVO(userId, accessToken, refreshToken);
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getUserId(): number {
    return this.userId;
  }

  equals(other: SignupResponseVO): boolean {
    if (!other) return false;
    if (!(other instanceof SignupResponseVO)) return false;

    return (
      this.userId === other.userId &&
      this.accessToken === other.accessToken &&
      this.refreshToken === other.refreshToken
    );
  }

  hashCode(): string {
    return `${this.userId}-${this.accessToken}-${this.refreshToken}`;
  }
}
