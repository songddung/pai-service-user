import { SelectProfileResult } from 'src/adapter/in/http/dto/result/select-profile.result';
import { SelectProfileCommand } from 'src/application/command/select-profile.command';

export interface SelectProfileUseCase {
  execute(command: SelectProfileCommand): Promise<SelectProfileResult>;
}
