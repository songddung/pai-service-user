import type { ProfileType } from 'pai-shared-types';

export class CreateProfileResponseDto {
  profileId: string;
  userId: string;
  profileType: ProfileType;
  name: string;
  accessToken: string;
  refreshToken: string;
}
