import type { ProfileType, SelectProfileResponseData } from 'pai-shared-types';

export class SelectProfileResponseDto implements SelectProfileResponseData {
  userId: string;
  profileId: string;
  profileType: ProfileType;
  accessToken: string;
  refreshToken: string;
}
