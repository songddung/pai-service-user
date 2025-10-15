import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';
import { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';

@Injectable()
export class RedisRefreshTokenRepositoryAdapter
  implements RefreshTokenRepositoryPort
{
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(userId: number): string {
    return `refresh_token:${userId}`;
  }

  async save(userId: number, token: string, ttlSeconds: number): Promise<void> {
    const key = this.getKey(userId);
    await this.redis.set(key, token, 'EX', ttlSeconds);
  }

  async delete(userId: number): Promise<void> {
    const key = this.getKey(userId);
    await this.redis.del(key);
  }
}
