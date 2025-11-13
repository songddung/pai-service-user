import { Inject, Injectable } from '@nestjs/common';
import { GetProfilesUseCase } from '../port/in/get-profiles.use-case';
import type { ProfileQueryPort } from '../port/out/profile.query.port';
import type { MediaServicePort } from '../port/out/media-service.port';
import { USER_TOKENS } from 'src/user.token';
import { GetProfileCommand } from '../command/get-profile.command';

import { GetProfilesResult } from '../port/in/result/get-profiles.result';

@Injectable()
export class GetProfilesService implements GetProfilesUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQueryPort: ProfileQueryPort,
    @Inject(USER_TOKENS.MediaServicePort)
    private readonly mediaService: MediaServicePort,
  ) {}

  async execute(command: GetProfileCommand): Promise<GetProfilesResult> {
    const profiles = await this.profileQueryPort.findByUserId(command.userId);

    // avatarMediaId가 있는 프로필들의 미디어 정보 조회
    const mediaIds = profiles
      .map((p) => p.getAvatarMediaId())
      .filter((id): id is bigint => id !== null);

    let mediaMap = new Map<string, string>();
    if (mediaIds.length > 0) {
      try {
        const mediaList = await this.mediaService.getMediaByIds(mediaIds);
        mediaMap = new Map(
          mediaList.map((m) => [m.mediaId, m.cdnUrl]),
        );
      } catch (error) {
        console.error('Failed to fetch media info:', error);
      }
    }

    // Profile에 avatarUrl 추가
    const profilesWithUrls = profiles.map((profile) => {
      const avatarMediaId = profile.getAvatarMediaId();
      const avatarUrl = avatarMediaId
        ? mediaMap.get(String(avatarMediaId))
        : undefined;
      return { profile, avatarUrl };
    });

    if (command.profileType === 'parent') {
      return {
        profiles: profilesWithUrls
          .filter(({ profile }) => profile.isParent())
          .map(({ profile }) => profile),
        avatarUrls: profilesWithUrls
          .filter(({ profile }) => profile.isParent())
          .map(({ avatarUrl }) => avatarUrl),
      };
    }
    if (command.profileType === 'child') {
      return {
        profiles: profilesWithUrls
          .filter(({ profile }) => profile.isChild())
          .map(({ profile }) => profile),
        avatarUrls: profilesWithUrls
          .filter(({ profile }) => profile.isChild())
          .map(({ avatarUrl }) => avatarUrl),
      };
    }
    return {
      profiles: profilesWithUrls.map(({ profile }) => profile),
      avatarUrls: profilesWithUrls.map(({ avatarUrl }) => avatarUrl),
    };
  }
}
