export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      throw new Error('유효하지 않은 이메일 형식입니다');
    }
    return new Email(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
