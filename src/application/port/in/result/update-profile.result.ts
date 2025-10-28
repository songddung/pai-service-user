import { ProfileType } from 'src/domain/model/profile/enum/profile-type';

export interface UpdateProfileResult {
  profileId: number;
  userId: number;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId?: string;
  voiceMediaId?: string;
}
