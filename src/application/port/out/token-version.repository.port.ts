/**
 * Token Version Repository Port (쓰기 전용)
 * - Token version 증가 작업만 담당
 */
export interface TokenVersionRepositoryPort {
  /**
   * 계정 전체 토큰 버전 증가 (비밀번호 변경 등)
   * @param userId 사용자 ID
   * @returns 새로운 version 번호
   */
  incrementVersion(userId: number): Promise<number>;

  /**
   * 디바이스별 토큰 버전 증가 (로그아웃 시)
   * @param userId 사용자 ID
   * @param deviceId 디바이스 ID
   * @returns 새로운 version 번호
   */
  incrementDeviceVersion(userId: number, deviceId: string): Promise<number>;
}
