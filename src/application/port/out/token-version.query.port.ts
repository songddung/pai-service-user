/**
 * Token Version Query Port (읽기 전용)
 * - Token version 조회 작업만 담당
 */
export interface TokenVersionQueryPort {
  /**
   * 계정 전체 토큰 버전 조회
   * @param userId 사용자 ID
   * @returns 현재 version 번호 (없으면 1로 초기화)
   */
  getVersion(userId: number): Promise<number>;

  /**
   * 디바이스별 토큰 버전 조회
   * @param userId 사용자 ID
   * @param deviceId 디바이스 ID
   * @returns 현재 version 번호 (없으면 1로 초기화)
   */
  getDeviceVersion(userId: number, deviceId: string): Promise<number>;
}
