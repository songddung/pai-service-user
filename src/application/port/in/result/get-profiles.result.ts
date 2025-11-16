import { Profile } from 'src/domain/model/profile/entity/profile.entity';

export interface GetProfilesResult {
  profiles: Profile[];
  userId: string;
}
