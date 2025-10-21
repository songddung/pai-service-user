import { Injectable, Inject } from '@nestjs/common';
import type { GetChildProfilesUseCase } from 'src/application/port/in/get-child-profiles.use-case';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import { USER_TOKENS } from '../../user.token';
import { GetProfileCommand } from '../command/get-profile.command';
import { GetProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';

@Injectable()
export class GetChildProfilesService implements GetChildProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
  ) {}

  async execute(query: GetProfileCommand): Promise<GetProfilesResult> {
    // 1) userId로 모든 프로필 조회
    const profiles = await this.profileQueryPort.findByUserId(query.userId);

    // 2) child 타입만 필터링
    const childProfiles = profiles.filter((profile) => profile.ischild());

    return {
      profiles: childProfiles,
    };
  }
}
