import { LoginCommand } from 'src/application/command/login.command';
import { LoginResponseVO } from 'src/domain/model/user/vo/login-response.vo';

export interface LoginUseCase {
  execute(command: LoginCommand): Promise<LoginResponseVO>;
}
