import type { SelectProfileResponseData } from 'pai-shared-types';
import { SelectProfileCommand } from 'src/application/command/select-profile.command';

export interface SelectProfileUseCase {
  execute(command: SelectProfileCommand): Promise<SelectProfileResponseData>;
}
