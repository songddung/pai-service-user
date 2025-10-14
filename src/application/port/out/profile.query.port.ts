import { Profile } from '../../../domain/model/profile/profile.entity';

/**
 * Profile Query Port (읽기 전용)
 * - 조회 작업만 담당
 */
export interface ProfileQueryPort {
  findById(profileId: number): Promise<Profile | null>;
  findByUserId(userId: number): Promise<Profile[]>;
  existsById(profileId: number): Promise<boolean>;
  countByUserId(userId: number): Promise<number>;
}
