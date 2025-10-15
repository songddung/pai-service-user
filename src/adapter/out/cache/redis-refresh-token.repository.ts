import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(userId: number): string {
    return `refresh_token:${userId}`;
  }

  async save(userId: number, token: string, ttlSeconds: number): Promise<void> {
    const key = this.getKey(userId);
    await this.redis.set(key, token, 'EX', ttlSeconds);
  }

  async get(userId: number): Promise<string | null> {
    const key = this.getKey(userId);
    return await this.redis.get(key);
  }

  async delete(userId: number): Promise<void> {
    const key = this.getKey(userId);
    await this.redis.del(key);
  }

  async verify(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.get(userId);
    return storedToken === token;
  }
}
