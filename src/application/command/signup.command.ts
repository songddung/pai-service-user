export class SignupCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly address: string,
    public readonly deviceId: string,
  ) {}
}
