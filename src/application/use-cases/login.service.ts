import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../port/in/login.use-case';
import type { UserQueryPort } from '../port/out/user.query.port';
import type { TokenProvider } from '../port/out/token.provider';
import type { RefreshTokenRepositoryPort } from '../port/out/refresh-token.repository.port';
import type { TokenVersionRepositoryPort } from '../port/out/token-version.repository.port';
import { LoginResponseData } from 'pai-shared-types';
import * as bcrypt from 'bcrypt';
import { LoginCommand } from '../command/login.command';
import { USER_TOKENS } from '../../user.token';

@Injectable()
export class LoginService implements LoginUseCase {
  constructor(
    @Inject(USER_TOKENS.UserQueryPort)
    private readonly userQuery: UserQueryPort,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionRepositoryPort)
    private readonly tokenVersionRepository: TokenVersionRepositoryPort,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseData> {
    // 사용자 조회
    const user = await this.userQuery.findByEmail(command.email);

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(
      command.password,
      user.getPasswordHash(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 토큰 버전 증가 (이전 토큰 모두 무효화)
    const userId = Number(user.getId());
    const tokenVersion = await this.tokenVersionRepository.incrementVersion(
      userId,
    );

    // 새로운 버전으로 토큰 발급
    const tokenPair = await this.tokenProvider.generateBasicTokenPair(
      userId,
      tokenVersion,
    );

    // Redis에 RefreshToken 저장 (7일 TTL)
    await this.refreshTokenRepository.save(
      userId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    return {
      userId: String(userId),
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
