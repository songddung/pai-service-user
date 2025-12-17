import { ProfileType } from 'src/domain/model/profile/enum/profile-type';

export interface SelectProfileResult {
  userId: number;
  profileId: number;
  profileType: ProfileType;
  accessToken: string;
  refreshToken: string;
}
