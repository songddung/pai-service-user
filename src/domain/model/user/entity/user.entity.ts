// src/domain/model/user/user.entity.ts
export class User {
  private constructor(
    private readonly id: bigint | null, // 생성 시 null, DB 로드 후 값 존재
    private email: string,
    private passwordHash: string,
    private address: string | null,
    private latitude: number | null,
    private longitude: number | null,
    private readonly createdAt: Date,
  ) {}

  /**
   * ✅ 신규 회원 생성 (UseCase에서 사용)
   * - id는 아직 없음 (DB에서 생성)
   * - createdAt은 현재 시간
   */
  static create(props: {
    email: string;
    passwordHash: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  }): User {
    return new User(
      null,
      props.email,
      props.passwordHash,
      props.address ?? null,
      props.latitude ?? null,
      props.longitude ?? null,
      new Date(), // 생성 시점
    );
  }

  /**
   * ✅ DB or Persistence Layer에서 불러올 때 사용
   * - 이미 id와 createdAt이 존재함
   */
  static rehydrate(raw: {
    id: bigint;
    email: string;
    passwordHash: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    createdAt: Date;
  }): User {
    return new User(
      raw.id,
      raw.email,
      raw.passwordHash,
      raw.address,
      raw.latitude,
      raw.longitude,
      raw.createdAt,
    );
  }

  // =============================
  // ✅ Domain Getters (외부 노출)
  // =============================

  getId(): bigint | null {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getAddress(): string | null {
    return this.address;
  }

  getLatitude(): number | null {
    return this.latitude;
  }

  getLongitude(): number | null {
    return this.longitude;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  // =============================
  // ✅ Domain Logic (필요 시 확장)
  // =============================

  changeAddress(
    address: string,
    latitude: number | null,
    longitude: number | null,
  ): void {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
