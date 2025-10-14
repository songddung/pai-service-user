import type { ProfileType } from 'pai-shared-types';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResponseData>;
}

export interface CreateProfileResponseData {
  profileId: number;
  userId: number;
  profileType: ProfileType;
  name: string;
  accessToken: string;
  refreshToken: string;
}
