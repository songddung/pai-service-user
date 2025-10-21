import { ProfileType } from 'src/adapter/in/http/dto/enum/profile-type';

export class GetProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileType?: ProfileType,
  ) {}
}
