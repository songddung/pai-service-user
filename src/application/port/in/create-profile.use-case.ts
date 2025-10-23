import { CreateProfileCommand } from 'src/application/command/create-profile.command';
import { CreateProfileResponseVO } from 'src/domain/model/profile/vo/create-profile-response.vo';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResponseVO>;
}
