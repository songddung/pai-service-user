import type { ProfileType } from 'pai-shared-types';

export class SelectProfileResponseDto {
  userId: string;
  profileId: string;
  profileType: ProfileType;
  accessToken: string;
  refreshToken: string;
}
