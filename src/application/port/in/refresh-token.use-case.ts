import { RefreshTokenCommand } from 'src/application/command/refresh-token.command';

export interface RefreshTokenUseCase {
  execute(command: RefreshTokenCommand): Promise<RefreshTokenResult>;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}
