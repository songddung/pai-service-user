import type { SignupCommand } from 'src/application/command/signup.command';
import { SignupResult } from './result/signup.result';

export interface SignupUseCase {
  execute(command: SignupCommand): Promise<SignupResult>;
}
