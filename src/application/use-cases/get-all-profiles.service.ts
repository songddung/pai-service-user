import { Inject, Injectable } from '@nestjs/common';
import { GetProfilesUseCase } from '../port/in/get-all-profiles.use-case';
import type { ProfileQueryPort } from '../port/out/profile.query.port';
import { USER_TOKENS } from 'src/user.token';
import { GetProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';
import { GetProfileCommand } from '../command/get-profile.command';

@Injectable()
export class GetAllProfilesService implements GetProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
  ) {}

  async execute(command: GetProfileCommand): Promise<GetProfilesResult> {
    const profiles = await this.profileQueryPort.findByUserId(command.userId);

    return {
      profiles: profiles,
    };
  }
}
