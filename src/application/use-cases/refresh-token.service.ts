import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenUseCase } from '../port/in/refresh-token.use-case';
import { RefreshTokenCommand } from '../command/refresh-token.command';
import type { RefreshTokenQueryPort } from '../port/out/refresh-token.query.port';
import type { RefreshTokenRepositoryPort } from '../port/out/refresh-token.repository.port';
import type { TokenVersionRepositoryPort } from '../port/out/token-version.repository.port';
import type { TokenProvider } from '../port/out/token.provider';
import { USER_TOKENS } from '../../user.token';
import { RefreshTokenResult } from '../port/in/result/refresh-token.result.dto';

@Injectable()
export class RefreshTokenService implements RefreshTokenUseCase {
  constructor(
    @Inject(USER_TOKENS.RefreshTokenQueryPort)
    private readonly refreshTokenQuery: RefreshTokenQueryPort,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionRepositoryPort)
    private readonly tokenVersionRepository: TokenVersionRepositoryPort,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    // 1. Redis에 저장된 RefreshToken과 비교하여 검증
    const isValid = await this.refreshTokenQuery.verify(
      command.userId,
      command.refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('유효하지 않은 RefreshToken입니다.');
    }

    // 2. 토큰 버전 증가 (이전 토큰 모두 무효화)
    const newTokenVersion = await this.tokenVersionRepository.incrementVersion(
      command.userId,
    );

    // 3. 새로운 토큰 쌍 발급 (AccessToken + RefreshToken)
    const tokenPair = await this.tokenProvider.refreshTokenPair(
      command.refreshToken,
      newTokenVersion,
    );

    // 4. Redis에 새로운 RefreshToken 저장 (기존 것을 교체)
    await this.refreshTokenRepository.save(
      command.userId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
