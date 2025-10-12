// src/application/port/out/token.provider.ts

export interface TokenProvider {
  /**
   * 로그인 시 기본 토큰 생성 (userId만 포함)
   * @param userId 사용자 ID
   */
  generateBasicTokenPair(userId: number): Promise<TokenPair>;

  /**
   * 프로필 선택 후 완전한 토큰 생성 (userId + profileId + profileType)
   * @param userId 사용자 ID
   * @param profileId 프로필 ID
   * @param profileType 프로필 타입 (예: 'parent', 'child')
   */
  generateProfileTokenPair(
    userId: number,
    profileId: number,
    profileType: string,
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
   * Refresh Token으로 새로운 Access Token 재발급
   */
  refreshAccessToken(refreshToken: string): Promise<string>;
}

/**
 * 기본 토큰 페이로드 (로그인 직후)
 */
export interface BasicTokenPayload {
  userId: number;
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
