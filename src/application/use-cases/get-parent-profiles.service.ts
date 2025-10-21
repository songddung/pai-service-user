import { Injectable, Inject } from '@nestjs/common';
import type { GetParentProfilesUseCase } from 'src/application/port/in/get-parent-profiles.use-case';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import { USER_TOKENS } from '../../user.token';
import { GetProfileCommand } from '../command/get-profile.command';
import { GetProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';

@Injectable()
export class GetParentProfilesService implements GetParentProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
  ) {}

  async execute(command: GetProfileCommand): Promise<GetProfilesResult> {
    // 1) userId로 모든 프로필 조회
    const profiles = await this.profileQueryPort.findByUserId(command.userId);

    // 2) parent 타입만 필터링
    const parentProfiles = profiles.filter((profile) => profile.isparent());

    return {
      profiles: parentProfiles,
    };
  }
}
