import { ProfileType } from 'src/adapter/in/http/dto/enum/profile-type';

export class CreateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileType: ProfileType,
    public readonly name: string,
    public readonly birthDate: string, // YYYY-MM-DD
    public readonly gender: string,
    public readonly avatarMediaId?: string,
    public readonly pin?: string, // 해시 전 원본 PIN
    public readonly voiceMediaId?: string,
  ) {}
}
