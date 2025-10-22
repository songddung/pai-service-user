import { ProfileType } from '../enum/profile-type';

export interface UpdateProfileResult {
  profileId: number;
  userId: number;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId?: number;
  voiceMediaId?: number;
}
