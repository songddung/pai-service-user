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

  async generateBasicTokenPair(
    userId: number,
    deviceId: string,
    tokenVersion: number,
  ): Promise<TokenPair> {
    const payload: BasicTokenPayload = {
      userId,
      deviceId,
      tokenVersion,
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
    deviceId: string,
    tokenVersion: number,
  ): Promise<TokenPair> {
    const payload: ProfileTokenPayload = {
      userId,
      deviceId,
      tokenVersion,
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

  async refreshTokenPair(
    refreshToken: string,
    deviceId: string,
    newTokenVersion: number,
  ): Promise<TokenPair> {
    // Refresh Token 검증
    const payload = await this.verifyRefreshToken(refreshToken);

    // JWT 메타데이터 제거 (iat, exp, sub, tokenVersion, deviceId 등)
    const { iat, exp, sub, tokenVersion, deviceId: _, ...cleanPayload } = payload as any;

    // 새로운 payload 생성 (명시적으로 전달받은 deviceId 사용)
    const newPayload = {
      userId: payload.userId,
      deviceId: deviceId, // 명시적으로 전달받은 deviceId 사용
      tokenVersion: newTokenVersion, // 새로운 버전으로 교체
      sub: String(payload.userId),
      ...cleanPayload,
    };

    // 새로운 AccessToken 발급
    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
        '30m') as string,
    } as JwtSignOptions);

    // 새로운 RefreshToken 발급
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
        '7d') as string,
    } as JwtSignOptions);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
