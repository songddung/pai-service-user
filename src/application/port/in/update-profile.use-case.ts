import type { UpdateProfileResponseData } from 'pai-shared-types';
import type { UpdateProfileCommand } from 'src/application/command/update-profile.command';

export interface UpdateProfileUseCase {
  execute(command: UpdateProfileCommand): Promise<UpdateProfileResponseData>;
}
