import { CreateProfileResult } from 'src/adapter/in/http/dto/result/create-profile.result';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResult>;
}
