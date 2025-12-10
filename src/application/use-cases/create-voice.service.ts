import { Inject, Injectable } from '@nestjs/common';
import { CreateVoiceUseCase } from '../port/in/create-voice.use-case';
import { USER_TOKENS } from 'src/user.token';
import type { ProfileRepositoryPort } from '../port/out/profile.repository.port';
import type { ProfileQueryPort } from '../port/out/profile.query.port';
import { CreateVoiceCommand } from '../command/create-voice.command';
import { CreateVoiceResult } from '../port/in/result/create-voice.result.dto';
import type { ElevenLabsUseCase } from '../port/out/elevenLabs.use-case';

@Injectable()
export class CreateVoiceService implements CreateVoiceUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileRepositoryPort)
    private readonly profileRespository: ProfileRepositoryPort,

    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQuery: ProfileQueryPort,

    @Inject(USER_TOKENS.ElevenLabsUseCase)
    private readonly elevenLabsService: ElevenLabsUseCase,
  ) {}

  async execute(command: CreateVoiceCommand): Promise<CreateVoiceResult> {
    const profile = await this.profileQuery.findById(command.profileId);

    if (!profile) {
      throw new Error('profile not found');
    }

    const newVoice = await this.elevenLabsService.createVoice(
      command.name,
      command.files,
    );

    if (profile.getVoiceMediaId()) {
      try {
        await this.elevenLabsService.deleteVoice(profile.getVoiceMediaId()!);
      } catch (error) {
        throw new Error('Failed to delete voice');
      }
    }
    profile.updateVoice(newVoice.voiceId);

    await this.profileRespository.update(profile);

    return newVoice;
  }
}
