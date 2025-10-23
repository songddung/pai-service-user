import { User } from '../../../domain/model/user/entity/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
