// src/application/port/out/profile.repository.ts

import { Profile } from 'src/domain/model/profile/profile.entity';

export interface ProfileRepository {
  /**
   * 프로필 저장
   */
  save(profile: Profile): Promise<Profile>;

  /**
   * 프로필 ID로 조회
   */
  findById(profileId: number): Promise<Profile | null>;

  /**
   * 사용자 ID로 프로필 목록 조회
   */
  findByUserId(userId: number): Promise<Profile[]>;

  /**
   * 프로필 삭제
   */
  delete(profileId: number): Promise<void>;
}
