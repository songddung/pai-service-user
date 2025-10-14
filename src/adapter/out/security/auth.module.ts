// src/adapter/out/security/auth.module.ts (별도 생성)
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenProvider } from './jwt/jwt-token.provider';
import { USER_TOKENS } from '../../../user.token';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    {
      provide: USER_TOKENS.TokenProvider,
      useClass: JwtTokenProvider,
    },
  ],
  exports: [USER_TOKENS.TokenProvider], // ← 다른 모듈에서 사용 가능하도록
})
export class AuthModule {}
