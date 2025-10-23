import { IsEnum } from 'class-validator';
import { GetProfileRequestDto as IGetProfileRequestDto } from 'pai-shared-types';
import type { ProfileType } from '../enum/profile-type';

export class GetProfileRequestDto implements IGetProfileRequestDto {
  @IsEnum(['parent', 'child'], {
    message: 'profileType must be either "parent" or "child"',
  })
  profileType: ProfileType;
}
