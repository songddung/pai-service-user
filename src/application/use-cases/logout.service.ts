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
    // 1. Token Version 증가 (모든 기존 AccessToken 무효화)
    await this.tokenVersionRepository.incrementVersion(command.userId);

    // 2. Redis에서 RefreshToken 삭제
    await this.refreshTokenRepository.delete(command.userId);
  }
}
