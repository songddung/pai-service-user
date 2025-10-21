import { DeleteProfileResult } from 'src/adapter/in/http/dto/result/delete-profile.result';
import type { DeleteProfileCommand } from 'src/application/command/delete-profile.command';

export interface DeleteProfileUseCase {
  execute(command: DeleteProfileCommand): Promise<DeleteProfileResult>;
}
