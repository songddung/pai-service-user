export interface KakaoAddressService {
  /**
   * 주소 문자열을 받아 위도/경도를 반환한다.
   * 주소가 유효하지 않으면 null 반환 또는 예외 처리 가능.
   */
  getLatLng(address: string): Promise<{
    latitude: number;
    longitude: number;
  } | null>;
}
