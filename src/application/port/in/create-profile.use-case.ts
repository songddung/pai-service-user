import type { CreateProfileResponseData, ProfileType } from 'pai-shared-types';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResponseData>;
}
