import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenUseCase } from '../port/in/refresh-token.use-case';
import { RefreshTokenCommand } from '../command/refresh-token.command';
import type { RefreshTokenQueryPort } from '../port/out/refresh-token.query.port';
import type { RefreshTokenRepositoryPort } from '../port/out/refresh-token.repository.port';
import type { TokenVersionQueryPort } from '../port/out/token-version.query.port';
import type { TokenProvider } from '../port/out/token.provider';
import type { TokenPayload } from '../port/out/token.provider';
import { USER_TOKENS } from '../../user.token';
import { RefreshTokenResult } from '../port/in/result/refresh-token.result.dto';

@Injectable()
export class RefreshTokenService implements RefreshTokenUseCase {
  constructor(
    @Inject(USER_TOKENS.RefreshTokenQueryPort)
    private readonly refreshTokenQuery: RefreshTokenQueryPort,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionQueryPort)
    private readonly tokenVersionQuery: TokenVersionQueryPort,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    // 0. RefreshToken에서 userId 추출 (JWT 검증)
    let payload: TokenPayload;
    try {
      payload = await this.tokenProvider.verifyRefreshToken(
        command.refreshToken,
      );
    } catch {
      throw new UnauthorizedException('유효하지 않은 RefreshToken입니다.');
    }

    const userId = payload.userId;

    // 1. Redis에 저장된 RefreshToken과 비교하여 검증 (디바이스별로 검증)
    const isValid = await this.refreshTokenQuery.verify(
      userId,
      command.deviceId,
      command.refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('유효하지 않은 RefreshToken입니다.');
    }

    // 2. 현재 디바이스의 토큰 버전 조회
    const deviceVersion = await this.tokenVersionQuery.getDeviceVersion(
      userId,
      command.deviceId,
    );

    // 3. 새로운 토큰 쌍 발급 (디바이스 버전으로 갱신)
    const tokenPair = await this.tokenProvider.refreshTokenPair(
      command.refreshToken,
      command.deviceId,
      deviceVersion,
    );

    // 4. Redis에 새로운 RefreshToken 저장 (디바이스별로 교체)
    await this.refreshTokenRepository.save(
      userId,
      command.deviceId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
