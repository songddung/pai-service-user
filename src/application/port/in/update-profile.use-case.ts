import type { UpdateProfileCommand } from 'src/application/command/update-profile.command';
import { UpdateProfileResult } from './result/update-profile.result';

export interface UpdateProfileUseCase {
  execute(command: UpdateProfileCommand): Promise<UpdateProfileResult>;
}
