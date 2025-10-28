export class UpdateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileId: number,
    public readonly name?: string,
    public readonly birthDate?: string, // YYYY-MM-DD
    public readonly gender?: string,
    public readonly avatarMediaId?: BigInt,
    public readonly voiceMediaId?: BigInt,
    public readonly pin?: string, // 부모 프로필 PIN 변경 시
  ) {}
}
