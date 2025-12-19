import { Inject, Injectable } from '@nestjs/common';
import { GetProfilesUseCase } from '../port/in/get-profiles.use-case';
import type { ProfileQueryPort } from '../port/out/profile.query.port';
import { USER_TOKENS } from 'src/user.token';
import { GetProfileCommand } from '../command/get-profile.command';

import { GetProfilesResult } from '../port/in/result/get-profiles.result';

@Injectable()
export class GetProfilesService implements GetProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
  ) {}

  async execute(command: GetProfileCommand): Promise<GetProfilesResult> {
    const profiles = await this.profileQueryPort.findByUserId(command.userId);

    if (command.profileType === 'parent') {
      return {
        profiles,
        userId: String(command.userId),
      };
    }
    if (command.profileType === 'child') {
      return {
        profiles,
        userId: String(command.userId),
      };
    }
    return {
      profiles,
      userId: String(command.userId),
    };
  }
}
