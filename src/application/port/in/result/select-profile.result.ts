import { ProfileType } from 'src/adapter/in/http/dto/enum/profile-type';

export interface SelectProfileResult {
  userId: number;
  profileId: number;
  profileType: ProfileType;
  accessToken: string;
  refreshToken: string;
}
