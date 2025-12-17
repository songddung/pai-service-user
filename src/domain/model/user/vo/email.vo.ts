export class Email {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  static create(value: string): Email {
    const trimmed = value.trim();

    if (!trimmed || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmed)) {
      throw new Error('유효하지 않은 이메일 형식입니다');
    }
    return new Email(trimmed.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this.value === other.value;
  }
}
