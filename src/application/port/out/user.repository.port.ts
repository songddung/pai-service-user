import { User } from '../../../domain/model/user/user.entity';

/**
 * User Repository Port (쓰기 전용)
 * - 저장/수정/삭제 작업만 담당
 */
export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(userId: number): Promise<void>;
}
