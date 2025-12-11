import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RefreshTokenQueryPort } from 'src/application/port/out/refresh-token.query.port';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisRefreshTokenQueryAdapter implements RefreshTokenQueryPort {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(userId: number, deviceId: string): string {
    return `refresh_token:${userId}:${deviceId}`;
  }

  async get(userId: number, deviceId: string): Promise<string | null> {
    const key = this.getKey(userId, deviceId);
    return await this.redis.get(key);
  }

  async verify(
    userId: number,
    deviceId: string,
    token: string,
  ): Promise<boolean> {
    const storedToken = await this.get(userId, deviceId);
    return storedToken === token;
  }
}
