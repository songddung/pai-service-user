import { LoginCommand } from 'src/application/command/login.command';
import type { LoginResponseData } from 'pai-shared-types';

export interface LoginUseCase {
  execute(command: LoginCommand): Promise<LoginResponseData>;
}
