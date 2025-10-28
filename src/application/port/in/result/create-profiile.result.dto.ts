import { ProfileType } from 'src/domain/model/profile/enum/profile-type';

export interface CreateProfileResult {
  userId: number;
  profileId: number;
  profileType: ProfileType;
  name: string;
  birthDate: string;
  gender: string;
  avatarMediaId: BigInt | null;
}
