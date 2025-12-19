export class Gender {
  private static readonly VALID_VALUES = ['MALE', 'FEMALE'] as const;

  private constructor(
    private readonly value: (typeof Gender.VALID_VALUES)[number],
  ) {
    Object.freeze(this);
  }

  static create(value: string): Gender {
    const normalized = value?.trim().toUpperCase();

    if (
      !normalized ||
      !Gender.VALID_VALUES.includes(
        normalized as (typeof Gender.VALID_VALUES)[number],
      )
    ) {
      throw new Error('유효하지 않은 성별입니다. (MALE 또는 FEMALE)');
    }

    return new Gender(normalized as (typeof Gender.VALID_VALUES)[number]);
  }

  getValue(): string {
    return this.value;
  }

  isMale(): boolean {
    return this.value === 'MALE';
  }

  isFemale(): boolean {
    return this.value === 'FEMALE';
  }

  equals(other: Gender): boolean {
    if (!(other instanceof Gender)) {
      return false;
    }
    return this.value === other.value;
  }
}
