// 쓰기 전용
export interface RefreshTokenRepositoryPort {
  /**
   * RefreshToken 저장
   * @param userId 사용자 ID
   * @param token RefreshToken
   * @param ttlSeconds 만료 시간 (초)
   */
  save(userId: number, token: string, ttlSeconds: number): Promise<void>;

  /**
   * RefreshToken 삭제 (로그아웃)
   * @param userId 사용자 ID
   */
  delete(userId: number): Promise<void>;
}
