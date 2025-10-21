import { ProfileType } from '../enum/profile-type';

export interface SelectProfileResult {
  userId: number;
  profileId: number;
  profileType: ProfileType;
  accessToken: string;
  refreshToken: string;
}
