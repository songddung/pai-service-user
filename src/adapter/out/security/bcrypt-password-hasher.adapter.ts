import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { PasswordHasher } from 'src/application/port/out/password-hasher';

/**
 * Bcrypt를 사용한 비밀번호 해싱 Adapter
 * Infrastructure 계층에서 외부 라이브러리(bcrypt) 의존성 처리
 */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    const saltRoundsStr = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    this.saltRounds = saltRoundsStr ? parseInt(saltRoundsStr, 10) : 12;
  }

  async hash(rawPassword: string): Promise<string> {
    return bcrypt.hash(rawPassword, this.saltRounds);
  }

  async compare(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }
}
