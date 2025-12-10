import { Profile } from 'src/domain/model/profile/entity/profile.entity';

export interface GetProfileIdResult {
  profile: Profile;
  userId: string;
}
