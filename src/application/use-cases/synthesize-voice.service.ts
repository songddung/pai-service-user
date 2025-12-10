import { Inject, Injectable } from '@nestjs/common';
import { SynthesizeVoiceUseCase } from '../port/in/synthesize-voice.use-case';
import { USER_TOKENS } from 'src/user.token';
import type { ProfileQueryPort } from '../port/out/profile.query.port';
import type { ElevenLabsUseCase } from '../port/out/elevenLabs.use-case';
import { SynthesizeVoiceCommand } from '../command/synthesize-voice.command';

@Injectable()
export class SynthesizeVoiceService implements SynthesizeVoiceUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
    @Inject(USER_TOKENS.ElevenLabsUseCase)
    private readonly elevenLabsService: ElevenLabsUseCase,
  ) {}

  async execute(command: SynthesizeVoiceCommand): Promise<Buffer> {
    const profile = await this.profileQueryPort.findById(command.profileId);

    if (!profile) {
      throw new Error('profile not found');
    }
    const voiceId = profile.getVoiceMediaId();
    if (!voiceId) {
      throw new Error('voice not found');
    }

    const voice = await this.elevenLabsService.synthesize(
      voiceId,
      command.text,
    );

    return voice;
  }
}
