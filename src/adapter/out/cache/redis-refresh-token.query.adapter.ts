import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RefreshTokenQueryPort } from 'src/application/port/out/refresh-token.query.port';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisRefreshTokenQueryAdapter implements RefreshTokenQueryPort {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(userId: number): string {
    return `refresh_token:${userId}`;
  }

  async get(userId: number): Promise<string | null> {
    const key = this.getKey(userId);
    return await this.redis.get(key);
  }

  async verify(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.get(userId);
    return storedToken === token;
  }
}
