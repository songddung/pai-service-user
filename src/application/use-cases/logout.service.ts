import { Injectable, Inject } from '@nestjs/common';
import type { LogoutUseCase } from 'src/application/port/in/logout.use-case';
import { LogoutCommand } from 'src/application/command/logout.command';
import type { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';
import type { TokenVersionRepositoryPort } from 'src/application/port/out/token-version.repository.port';
import { USER_TOKENS } from '../../user.token';

@Injectable()
export class LogoutService implements LogoutUseCase {
  constructor(
    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionRepositoryPort)
    private readonly tokenVersionRepository: TokenVersionRepositoryPort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    // 1. 해당 디바이스의 토큰 버전 증가 (해당 디바이스의 AccessToken만 무효화)
    await this.tokenVersionRepository.incrementDeviceVersion(
      command.userId,
      command.deviceId,
    );

    // 2. Redis에서 해당 디바이스의 RefreshToken 삭제
    await this.refreshTokenRepository.delete(command.userId, command.deviceId);
  }
}
