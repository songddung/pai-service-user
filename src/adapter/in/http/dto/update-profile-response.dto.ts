import type { ProfileType } from 'pai-shared-types';

export class UpdateProfileResponseDto {
  profileId: string;
  userId: string;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId?: string;
  voiceMediaId?: string;
}
