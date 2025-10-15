export class RefreshTokenCommand {
  constructor(
    public readonly userId: number,
    public readonly refreshToken: string,
  ) {}
}
