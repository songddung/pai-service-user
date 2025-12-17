export class DeleteProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileId: number,
  ) {}
}
