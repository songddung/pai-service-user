export class CreateVoiceCommand {
  constructor(
    public readonly name: string,
    public readonly profileId: number,
    public readonly files: Express.Multer.File[],
  ) {}
}
