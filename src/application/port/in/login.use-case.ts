import { LoginResult } from 'src/adapter/in/http/dto/result/login.result';
import { LoginCommand } from 'src/application/command/login.command';

export interface LoginUseCase {
  execute(command: LoginCommand): Promise<LoginResult>;
}
