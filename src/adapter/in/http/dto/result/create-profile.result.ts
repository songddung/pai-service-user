import { ProfileType } from '../enum/profile-type';

export interface CreateProfileResult {
  profileId: number;
  userId: number;
  profileType: ProfileType;
  name: string;
  accessToken: string;
  refreshToken: string;
}
