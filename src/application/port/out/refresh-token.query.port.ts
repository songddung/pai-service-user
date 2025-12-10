// RefreshToken Query Port (읽기 전용)

export interface RefreshTokenQueryPort {
  /**
   * RefreshToken 조회
   * @param userId 사용자 ID
   * @returns RefreshToken (없으면 null)
   */
  get(userId: number): Promise<string | null>;

  /**
   * RefreshToken 검증
   * @param userId 사용자 ID
   * @param token 검증할 토큰
   * @returns 토큰이 일치하면 true
   */
  verify(userId: number, token: string): Promise<boolean>;
}
