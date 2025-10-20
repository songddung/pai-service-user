import type { ProfileType, CreateProfileResponseData } from 'pai-shared-types';

export class CreateProfileResponseDto implements CreateProfileResponseData {
  profileId: string;
  userId: string;
  profileType: ProfileType;
  name: string;
  accessToken: string;
  refreshToken: string;
}
