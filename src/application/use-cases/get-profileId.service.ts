import { Inject, Injectable } from '@nestjs/common';
import { GetProfileIdUseCase } from '../port/in/get-profileId.use-case';
import { USER_TOKENS } from 'src/user.token';
import type { ProfileQueryPort } from '../port/out/profile.query.port';
import { GetProfileIdResult } from '../port/in/result/get-profileId.result';
import { GetProfileIdCommand } from '../command/get-profileId.command';

@Injectable()
export class GetProfileIdService implements GetProfileIdUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
  ) {}

  async execute(command: GetProfileIdCommand): Promise<GetProfileIdResult> {
    const profile = await this.profileQueryPort.findById(command.profileId);
    if (!profile) {
      throw new Error(`Profile with ID ${command.profileId} not found.`);
    }
    return { profile: profile, userId: String(command.userId) };
  }
}
