export class SelectProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileId: number,
    public readonly pin?: string, // 부모 프로필 선택 시 필수
  ) {}
}
