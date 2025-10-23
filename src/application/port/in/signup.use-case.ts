import type { SignupCommand } from 'src/application/command/signup.command';
import { SignupResponseVO } from 'src/domain/model/user/vo/signup-response.vo';

export interface SignupUseCase {
  execute(command: SignupCommand): Promise<SignupResponseVO>;
}
