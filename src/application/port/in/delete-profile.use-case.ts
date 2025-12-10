import type { DeleteProfileCommand } from 'src/application/command/delete-profile.command';
import { DeleteProfileResult } from './result/delete-profile.result.dto';

export interface DeleteProfileUseCase {
  execute(command: DeleteProfileCommand): Promise<DeleteProfileResult>;
}
