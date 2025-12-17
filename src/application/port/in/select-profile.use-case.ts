import { SelectProfileCommand } from 'src/application/command/select-profile.command';
import { SelectProfileResult } from './result/select-profile.result';

export interface SelectProfileUseCase {
  execute(command: SelectProfileCommand): Promise<SelectProfileResult>;
}
