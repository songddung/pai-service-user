import { Profile } from 'src/domain/model/profile/profile.entity';

export interface GetParentProfilesResult {
  profiles: Profile[];
}

export interface GetChildProfilesResult {
  profiles: Profile[];
}
