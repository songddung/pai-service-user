/**
 * Token Version Repository Port (쓰기 전용)
 * - Token version 증가 작업만 담당
 */
export interface TokenVersionRepositoryPort {
  /**
   * Token version 증가 (새로운 토큰 발급 시)
   * @param userId 사용자 ID
   * @returns 새로운 version 번호
   */
  incrementVersion(userId: number): Promise<number>;
}
