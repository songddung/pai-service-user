import { RefreshTokenResult } from 'src/adapter/in/http/dto/result/refresh-token.result';
import { RefreshTokenCommand } from 'src/application/command/refresh-token.command';

export interface RefreshTokenUseCase {
  execute(command: RefreshTokenCommand): Promise<RefreshTokenResult>;
}
