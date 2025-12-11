/**
 * RefreshToken Repository Port (쓰기 전용)
 * - 저장/삭제 작업만 담당
 */
export interface RefreshTokenRepositoryPort {
  /**
   * RefreshToken 저장
   * @param userId 사용자 ID
   * @param deviceId 디바이스 ID
   * @param token RefreshToken
   * @param ttlSeconds 만료 시간 (초)
   */
  save(
    userId: number,
    deviceId: string,
    token: string,
    ttlSeconds: number,
  ): Promise<void>;

  /**
   * RefreshToken 삭제 (로그아웃)
   * @param userId 사용자 ID
   * @param deviceId 디바이스 ID
   */
  delete(userId: number, deviceId: string): Promise<void>;

  /**
   * 사용자의 모든 디바이스 RefreshToken 삭제
   * @param userId 사용자 ID
   */
  deleteAll(userId: number): Promise<void>;
}
