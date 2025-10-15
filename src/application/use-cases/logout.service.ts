import { Injectable, Inject } from '@nestjs/common';
import type { LogoutUseCase } from 'src/application/port/in/logout.use-case';
import { LogoutCommand } from 'src/application/command/logout.command';
import type { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';
import { USER_TOKENS } from '../../user.token';

@Injectable()
export class LogoutService implements LogoutUseCase {
  constructor(
    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    // Redis에서 RefreshToken 삭제
    await this.refreshTokenRepository.delete(command.userId);
  }
}
