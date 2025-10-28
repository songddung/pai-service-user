export class ProfileName {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  static create(value: string): ProfileName {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('이름은 필수입니다.');
    }

    if (trimmed.length > 50) {
      throw new Error('이름은 50자를 초과할 수 없습니다.');
    }

    if (trimmed.length < 1) {
      throw new Error('이름은 최소 1자 이상이어야 합니다.');
    }

    return new ProfileName(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProfileName): boolean {
    if (!(other instanceof ProfileName)) {
      return false;
    }
    return this.value === other.value;
  }
}
