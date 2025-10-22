import { LoginCommand } from 'src/application/command/login.command';
import { LoginResult } from './result/login.result';

export interface LoginUseCase {
  execute(command: LoginCommand): Promise<LoginResult>;
}
