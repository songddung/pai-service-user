import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TokenVersionRepositoryPort } from 'src/application/port/out/token-version.repository.port';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisTokenVersionRepositoryAdapter
  implements TokenVersionRepositoryPort
{
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // 계정 레벨 버전 키
  private getAccountKey(userId: number): string {
    return `token_version:${userId}`;
  }

  // 디바이스별 버전 키
  private getDeviceKey(userId: number, deviceId: string): string {
    return `token_version:${userId}:${deviceId}`;
  }

  async incrementVersion(userId: number): Promise<number> {
    const key = this.getAccountKey(userId);
    // 계정 레벨 버전 증가 (비밀번호 변경 등에 사용)
    const newVersion = await this.redis.incr(key);
    return newVersion;
  }

  async incrementDeviceVersion(userId: number, deviceId: string): Promise<number> {
    const key = this.getDeviceKey(userId, deviceId);
    // Redis INCR: 값을 1 증가시키고 새로운 값 반환 (없으면 1부터 시작)
    const newVersion = await this.redis.incr(key);
    return newVersion;
  }
}
