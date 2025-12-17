import { CreateProfileCommand } from 'src/application/command/create-profile.command';
import { CreateProfileResult } from './result/create-profiile.result.dto';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResult>;
}
