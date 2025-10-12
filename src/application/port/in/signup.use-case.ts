import { SignupResponseData } from 'pai-shared-types';

import type { SignupCommand } from 'src/application/command/signup.command';

export interface SignupUseCase {
  execute(command: SignupCommand): Promise<SignupResponseData>;
}
