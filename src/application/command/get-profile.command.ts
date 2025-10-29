import { GetProfileType } from 'src/domain/model/profile/enum/profile-type';

export class GetProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly profileType?: GetProfileType,
  ) {}
}
