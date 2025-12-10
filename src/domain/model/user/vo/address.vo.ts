export class Address {
  private constructor(
    private readonly address: string,
    private readonly latitude: number,
    private readonly longitude: number,
  ) {
    Object.freeze(this);
  }

  static create(address: string, latitude: number, longitude: number): Address {
    if (!address || address.trim() === '') {
      throw new Error('주소는 필수입니다.');
    }
    if (latitude === null || longitude === null) {
      throw new Error('유효한 주소가 아닙니다.');
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error('위도는  -90 ~ 90 사이여야 합니다.');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('경도는 -180 ~ 180 사이여야 합니다.');
    }
    return new Address(address, latitude, longitude);
  }

  getAddress(): string {
    return this.address;
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  equals(other: Address): boolean {
    if (!(other instanceof Address)) {
      return false;
    }
    return (
      this.address === other.getAddress() &&
      this.latitude === other.getLatitude() &&
      this.longitude === other.getLongitude()
    );
  }
}
