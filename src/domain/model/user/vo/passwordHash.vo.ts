export class PasswordHash {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  static create(value: string): PasswordHash {
    if (!value || value.length < 60) {
      throw new Error('해시된 비밀번호 형식이 올바르지 않습니다');
    }
    return new PasswordHash(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PasswordHash): boolean {
    return this.value === other.value;
  }
}
