// src/application/use-cases/get-child-profiles.service.ts

import { Injectable, Inject } from '@nestjs/common';
import type {
  GetChildProfilesUseCase,
  GetChildProfilesQuery,
} from 'src/application/port/in/get-child-profiles.use-case';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import type { GetChildProfilesResponseData } from 'pai-shared-types';
import { USER_TOKENS } from '../../user.token';
import { ProfileMapper } from '../../mapper/profile.mapper';

@Injectable()
export class GetChildProfilesService implements GetChildProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
    private readonly profileMapper: ProfileMapper,
  ) {}

  async execute(
    query: GetChildProfilesQuery,
  ): Promise<GetChildProfilesResponseData> {
    // 1) userId로 모든 프로필 조회
    const profiles = await this.profileQueryPort.findByUserId(query.userId);

    // 2) child 타입만 필터링
    const childProfiles = profiles.filter((profile) => profile.ischild());

    // 3) Mapper를 사용하여 DTO로 변환
    const profileDtos = this.profileMapper.toDtoList(childProfiles);

    return {
      profiles: profileDtos,
    };
  }
}
