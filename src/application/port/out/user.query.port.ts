import { User } from '../../../domain/model/user/entity/user.entity';

/**
 * User Query Port (읽기 전용)
 * - 조회 작업만 담당
 */
export interface UserQueryPort {
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  findById(userId: number): Promise<User | null>;
}
