// src/adapter/out/security/jwt/jwt-token.provider.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  TokenProvider,
  TokenPayload,
  TokenPair,
  BasicTokenPayload,
  ProfileTokenPayload,
} from 'src/application/port/out/token.provider';

@Injectable()
export class JwtTokenProvider implements TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateBasicTokenPair(userId: number): Promise<TokenPair> {
    const payload: BasicTokenPayload = {
      userId,
      sub: String(userId), // JWT 표준: subject claim
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
        '30m') as string,
    } as JwtSignOptions);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
        '7d') as string,
    } as JwtSignOptions);

    return { accessToken, refreshToken };
  }

  async generateProfileTokenPair(
    userId: number,
    profileId: number,
    profileType: string,
  ): Promise<TokenPair> {
    const payload: ProfileTokenPayload = {
      userId,
      sub: String(userId), // JWT 표준: subject claim
      profileId,
      profileType,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
        '30m') as string,
    } as JwtSignOptions);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
        '7d') as string,
    } as JwtSignOptions);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 Access Token입니다.');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    // Refresh Token 검증
    const payload = await this.verifyRefreshToken(refreshToken);

    // 새로운 Access Token 발급 (동일한 페이로드로)
    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
        '30m') as string,
    } as JwtSignOptions);

    return newAccessToken;
  }
}
