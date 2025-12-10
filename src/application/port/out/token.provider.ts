export interface TokenProvider {
  /**
   * 로그인 시 기본 토큰 생성 (userId만 포함)
   * @param userId 사용자 ID
   * @param tokenVersion 토큰 버전
   */
  generateBasicTokenPair(
    userId: number,
    tokenVersion: number,
  ): Promise<TokenPair>;

  /**
   * 프로필 선택 후 완전한 토큰 생성 (userId + profileId + profileType)
   * @param userId 사용자 ID
   * @param profileId 프로필 ID
   * @param profileType 프로필 타입 (예: 'parent', 'child')
   * @param tokenVersion 토큰 버전
   */
  generateProfileTokenPair(
    userId: number,
    profileId: number,
    profileType: string,
    tokenVersion: number,
  ): Promise<TokenPair>;

  /**
   * Access Token 검증
   */
  verifyAccessToken(token: string): Promise<TokenPayload>;

  /**
   * Refresh Token 검증
   */
  verifyRefreshToken(token: string): Promise<TokenPayload>;

  /**
   * Refresh Token으로 새로운 토큰 쌍 재발급 (Rotation)
   * @param refreshToken 기존 RefreshToken
   * @param newTokenVersion 새로운 토큰 버전
   * @returns 새로운 AccessToken과 RefreshToken
   */
  refreshTokenPair(
    refreshToken: string,
    newTokenVersion: number,
  ): Promise<TokenPair>;
}

/**
 * 기본 토큰 페이로드 (로그인 직후)
 */
export interface BasicTokenPayload {
  userId: number;
  tokenVersion: number; // 토큰 버전 (무효화 용)
  sub?: string; // JWT 표준: subject (userId를 문자열로)
  iat?: number;
  exp?: number;
}

/**
 * 프로필 토큰 페이로드 (프로필 선택 후)
 */
export interface ProfileTokenPayload extends BasicTokenPayload {
  profileId: number;
  profileType: string;
}

/**
 * 통합 페이로드 타입
 */
export type TokenPayload = BasicTokenPayload | ProfileTokenPayload;

/**
 * 토큰 쌍 (Access + Refresh)
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
