export class GetProfileIdCommand {
  constructor(
    public readonly userId: number,
    public readonly profileId: number,
  ) {}
}
