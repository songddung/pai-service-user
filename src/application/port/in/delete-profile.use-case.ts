import type { DeleteProfileResponseData } from 'pai-shared-types';
import type { DeleteProfileCommand } from 'src/application/command/delete-profile.command';

export interface DeleteProfileUseCase {
  execute(command: DeleteProfileCommand): Promise<DeleteProfileResponseData>;
}
