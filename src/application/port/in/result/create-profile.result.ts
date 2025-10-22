import { ProfileType } from 'src/adapter/in/http/dto/enum/profile-type';

export interface CreateProfileResult {
  profileId: number;
  userId: number;
  profileType: ProfileType;
  name: string;
  accessToken: string;
  refreshToken: string;
}
