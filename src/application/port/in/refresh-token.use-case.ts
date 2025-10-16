import { RefreshTokenResult } from 'pai-shared-types';
import { RefreshTokenCommand } from 'src/application/command/refresh-token.command';

export interface RefreshTokenUseCase {
  execute(command: RefreshTokenCommand): Promise<RefreshTokenResult>;
}
