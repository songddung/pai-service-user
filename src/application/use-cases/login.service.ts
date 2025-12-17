import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../port/in/login.use-case';
import type { UserQueryPort } from '../port/out/user.query.port';
import type { TokenProvider } from '../port/out/token.provider';
import type { RefreshTokenRepositoryPort } from '../port/out/refresh-token.repository.port';
import type { TokenVersionQueryPort } from '../port/out/token-version.query.port';
import type { PasswordHasher } from '../port/out/password-hasher';
import { LoginCommand } from '../command/login.command';
import { USER_TOKENS } from '../../user.token';
import { LoginResult } from '../port/in/result/login.result.dto';

@Injectable()
export class LoginService implements LoginUseCase {
  constructor(
    @Inject(USER_TOKENS.UserQueryPort)
    private readonly userQuery: UserQueryPort,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionQueryPort)
    private readonly tokenVersionQuery: TokenVersionQueryPort,

    @Inject(USER_TOKENS.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    // 사용자 조회
    const user = await this.userQuery.findByEmail(command.email);

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const passwordHash = user.getPasswordHash();

    // 비밀번호 검증
    const isPasswordValid = await this.passwordHasher.compare(
      command.password,
      passwordHash.getValue(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 디바이스별 토큰 버전 조회 (멀티 디바이스 로그인 지원)
    const userId = Number(user.getId());
    const deviceVersion =
      await this.tokenVersionQuery.getDeviceVersion(userId, command.deviceId);

    // 디바이스별 버전으로 토큰 발급
    const tokenPair = await this.tokenProvider.generateBasicTokenPair(
      userId,
      command.deviceId,
      deviceVersion,
    );

    // Redis에 RefreshToken 저장 (디바이스별로 저장, 7일 TTL)
    await this.refreshTokenRepository.save(
      userId,
      command.deviceId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    return {
      userId: userId,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
