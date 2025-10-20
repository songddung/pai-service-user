import type { ProfileType, UpdateProfileResponseData } from 'pai-shared-types';

export class UpdateProfileResponseDto implements UpdateProfileResponseData {
  profileId: string;
  userId: string;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId?: string;
  voiceMediaId?: string;
}
