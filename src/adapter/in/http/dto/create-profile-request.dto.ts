import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import type { ProfileType } from 'pai-shared-types';

export class CreateProfileRequestDto {
  @IsEnum(['parent', 'child'], {
    message: 'profileType must be either "parent" or "child"',
  })
  profileType: ProfileType;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsDateString(
    {},
    { message: 'birthDate must be a valid date string (YYYY-MM-DD)' },
  )
  birthDate: string;

  @IsString()
  gender: string;

  @IsOptional()
  @IsInt()
  avatarMediaId?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;

  @IsOptional()
  @IsInt()
  voiceMediaId?: number;
}
