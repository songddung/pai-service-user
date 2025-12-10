export class SynthesizeVoiceCommand {
  constructor(
    public readonly text: string,
    public readonly profileId: number,
  ) {}
}
