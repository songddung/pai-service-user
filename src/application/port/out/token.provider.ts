import { User } from '../../../domain/model/user/user.entity';

export interface TokenProvider {
  generateAccessToken(user: User): string | Promise<string>;
  generateRefreshToken(user: User): string | Promise<string>;
}
