// src/adapter/out/security/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenProvider } from './jwt/jwt-token.provider';
import { BcryptPasswordHasher } from './bcrypt-password-hasher.adapter';
import { USER_TOKENS } from '../../../user.token';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    {
      provide: USER_TOKENS.TokenProvider,
      useClass: JwtTokenProvider,
    },
    {
      provide: USER_TOKENS.PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [USER_TOKENS.TokenProvider, USER_TOKENS.PasswordHasher],
})
export class AuthModule {}
