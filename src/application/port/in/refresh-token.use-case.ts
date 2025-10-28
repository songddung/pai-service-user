import { RefreshTokenCommand } from 'src/application/command/refresh-token.command';
import { RefreshTokenResult } from './result/refresh-token.result.dto';

export interface RefreshTokenUseCase {
  execute(command: RefreshTokenCommand): Promise<RefreshTokenResult>;
}
