import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';
import { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';

@Injectable()
export class RedisRefreshTokenRepositoryAdapter
  implements RefreshTokenRepositoryPort
{
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(userId: number, deviceId: string): string {
    return `refresh_token:${userId}:${deviceId}`;
  }

  private getUserPattern(userId: number): string {
    return `refresh_token:${userId}:*`;
  }

  async save(
    userId: number,
    deviceId: string,
    token: string,
    ttlSeconds: number,
  ): Promise<void> {
    const key = this.getKey(userId, deviceId);
    await this.redis.set(key, token, 'EX', ttlSeconds);
  }

  async delete(userId: number, deviceId: string): Promise<void> {
    const key = this.getKey(userId, deviceId);
    await this.redis.del(key);
  }

  async deleteAll(userId: number): Promise<void> {
    const pattern = this.getUserPattern(userId);
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
