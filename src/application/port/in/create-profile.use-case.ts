import { CreateProfileCommand } from 'src/application/command/create-profile.command';
import { CreateProfileResult } from './result/create-profile.result';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResult>;
}
