import { LoginCommand } from 'src/application/command/login.command';
import { LoginResult } from './result/login.result.dto';

export interface LoginUseCase {
  execute(command: LoginCommand): Promise<LoginResult>;
}
