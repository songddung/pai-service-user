export class SelectProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileId: number,
  ) {}
}
