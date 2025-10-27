import { Address } from '../vo/address.vo';
import { Email } from '../vo/email.vo';
import { PasswordHash } from '../vo/passwordHash.vo';

// src/domain/model/user/user.entity.ts
export class User {
  private constructor(
    private readonly id: bigint | null, // 생성 시 null, DB 로드 후 값 존재
    private email: Email,
    private passwordHash: PasswordHash,
    private address: Address,
    private readonly createdAt: Date,
  ) {}

  /**
   * ✅ 신규 회원 생성 (UseCase에서 사용)
   * - id는 아직 없음 (DB에서 생성)
   * - createdAt은 현재 시간
   */
  static create(props: {
    email: Email;
    passwordHash: PasswordHash;
    address: Address;
  }): User {
    return new User(
      null,
      props.email,
      props.passwordHash,
      props.address,
      new Date(), // 생성 시점
    );
  }

  static reconstitute(props: {
    id: bigint; // 재구성 시 ID는 필수
    email: Email;
    passwordHash: PasswordHash;
    address: Address;
    createdAt: Date;
  }): User {
    // 💡 public 메서드 내에서 private constructor를 호출하여 엔티티를 복원
    return new User(
      props.id,
      props.email,
      props.passwordHash,
      props.address,
      props.createdAt,
    );
  }

  // =============================
  // ✅ Domain Getters (외부 노출)
  // =============================

  getId(): bigint | null {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  getAddress(): Address {
    return this.address;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  // =============================
  // ✅ Domain Logic
  // =============================

  updateEmail(newEmail: Email): void {
    if (this.email.equals(newEmail)) {
      return;
    }

    this.email = newEmail;
  }

  changePassword(newPasswordHash: PasswordHash): void {
    if (this.passwordHash.equals(newPasswordHash)) {
      throw new Error('기존의 비밀번호 같은 비밀번호로 변경할 수 없습니다.');
    }
    this.passwordHash = newPasswordHash;
  }

  updateAddress(newAddress: Address): void {
    if (this.address && newAddress && this.address.equals(newAddress)) {
      return;
    }
    this.address = newAddress;
  }
}
