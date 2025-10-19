import type { ProfileType } from 'pai-shared-types';

export class ProfileDto {
  profileId: string;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId?: string;
  voiceMediaId?: string;
  createdAt: string;
}

export class GetParentProfilesResponseDto {
  profiles: ProfileDto[];
}

export class GetChildProfilesResponseDto {
  profiles: ProfileDto[];
}
