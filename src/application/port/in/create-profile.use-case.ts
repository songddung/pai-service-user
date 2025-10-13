import type { ProfileType } from 'pai-shared-types';

export interface CreateProfileUseCase {
  execute(command: CreateProfileCommand): Promise<CreateProfileResponseData>;
}

export class CreateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileType: ProfileType,
    public readonly name: string,
    public readonly birthDate: string, // YYYY-MM-DD
    public readonly gender: string,
    public readonly avatarMediaId?: number,
    public readonly pin?: string, // 해시 전 원본 PIN
    public readonly voiceMediaId?: number,
  ) {}
}

export interface CreateProfileResponseData {
  profileId: number;
  userId: number;
  profileType: ProfileType;
  name: string;
  accessToken: string;
  refreshToken: string;
}
