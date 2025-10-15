import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TokenVersionRepositoryPort } from 'src/application/port/out/token-version.repository.port';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisTokenVersionRepositoryAdapter
  implements TokenVersionRepositoryPort
{
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(userId: number): string {
    return `user:${userId}:token_version`;
  }

  async incrementVersion(userId: number): Promise<number> {
    const key = this.getKey(userId);
    // Redis INCR: 값을 1 증가시키고 새로운 값 반환 (없으면 1부터 시작)
    const newVersion = await this.redis.incr(key);
    return newVersion;
  }
}
