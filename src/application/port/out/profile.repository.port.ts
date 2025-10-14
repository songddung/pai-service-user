import { Profile } from '../../../domain/model/profile/profile.entity';

/**
 * Profile Repository Port (쓰기 전용)
 * - 저장/수정/삭제 작업만 담당
 */
export interface ProfileRepositoryPort {
  save(profile: Profile): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
  delete(profileId: number): Promise<void>;
}
