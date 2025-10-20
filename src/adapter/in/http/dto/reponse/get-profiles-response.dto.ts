import type {
  ProfileType,
  ProfileDto as IProfileDto,
  GetParentProfilesResponseData,
  GetChildProfilesResponseData,
} from 'pai-shared-types';

export class ProfileDto implements IProfileDto {
  profileId: string;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId?: string;
  voiceMediaId?: string;
  createdAt: string;
}

export class GetParentProfilesResponseDto
  implements GetChildProfilesResponseData
{
  profiles: ProfileDto[];
}

export class GetChildProfilesResponseDto
  implements GetChildProfilesResponseData
{
  profiles: ProfileDto[];
}
