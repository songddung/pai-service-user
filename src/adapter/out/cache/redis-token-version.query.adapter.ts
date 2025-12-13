import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TokenVersionQueryPort } from 'src/application/port/out/token-version.query.port';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisTokenVersionQueryAdapter implements TokenVersionQueryPort {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // 계정 레벨 버전 키
  private getAccountKey(userId: number): string {
    return `token_version:${userId}`;
  }

  // 디바이스별 버전 키
  private getDeviceKey(userId: number, deviceId: string): string {
    return `token_version:${userId}:${deviceId}`;
  }

  async getVersion(userId: number): Promise<number> {
    const key = this.getAccountKey(userId);
    const version = await this.redis.get(key);

    if (!version) {
      // 초기값 1로 설정
      await this.redis.set(key, '1');
      return 1;
    }

    return parseInt(version, 10);
  }

  async getDeviceVersion(userId: number, deviceId: string): Promise<number> {
    const key = this.getDeviceKey(userId, deviceId);
    const version = await this.redis.get(key);

    if (!version) {
      // 초기값 1로 설정
      await this.redis.set(key, '1');
      return 1;
    }

    return parseInt(version, 10);
  }
}
