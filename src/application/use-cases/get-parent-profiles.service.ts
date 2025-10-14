// src/application/use-cases/get-parent-profiles.service.ts

import { Injectable, Inject } from '@nestjs/common';
import type {
  GetParentProfilesUseCase,
  GetParentProfilesQuery,
} from 'src/application/port/in/get-parent-profiles.use-case';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import type { GetParentProfilesResponseData } from 'pai-shared-types';
import { USER_TOKENS } from '../../user.token';
import { ProfileMapper } from '../../mapper/profile.mapper';

@Injectable()
export class GetParentProfilesService implements GetParentProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
    private readonly profileMapper: ProfileMapper,
  ) {}

  async execute(
    query: GetParentProfilesQuery,
  ): Promise<GetParentProfilesResponseData> {
    // 1) userId로 모든 프로필 조회
    const profiles = await this.profileQueryPort.findByUserId(query.userId);

    // 2) parent 타입만 필터링
    const parentProfiles = profiles.filter((profile) => profile.isparent());

    // 3) Mapper를 사용하여 DTO로 변환
    const profileDtos = this.profileMapper.toDtoList(parentProfiles);

    return {
      profiles: profileDtos,
    };
  }
}
