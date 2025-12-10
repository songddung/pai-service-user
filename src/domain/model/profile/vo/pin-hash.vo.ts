export class PinHash {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  static create(hashedPin: string): PinHash {
    if (!hashedPin || hashedPin.length < 60) {
      throw new Error('해시된 PIN 형식이 올바르지 않습니다');
    }
    return new PinHash(hashedPin);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PinHash): boolean {
    if (!(other instanceof PinHash)) {
      return false;
    }
    return this.value === other.value;
  }
}
