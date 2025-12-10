export class BirthDate {
  private constructor(private readonly value: Date) {
    Object.freeze(this);
  }

  static create(date: Date): BirthDate {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('유효한 날짜가 아닙니다.');
    }

    if (date > new Date()) {
      throw new Error('생년월일은 미래일 수 없습니다.');
    }

    const minDate = new Date('1900-01-01');
    if (date < minDate) {
      throw new Error('유효한 생년월일이 아닙니다.');
    }

    return new BirthDate(date);
  }

  getValue(): Date {
    return this.value;
  }

  getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.value.getFullYear();
    const monthDiff = today.getMonth() - this.value.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.value.getDate())
    ) {
      age--;
    }

    return age;
  }

  equals(other: BirthDate): boolean {
    if (!(other instanceof BirthDate)) {
      return false;
    }
    return this.value.getTime() === other.value.getTime();
  }
}
