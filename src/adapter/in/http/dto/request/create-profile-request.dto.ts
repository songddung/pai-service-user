import {
  IsEnum,
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import type {
  ProfileType,
  CreateProfileRequestDto as ICreateProfileRequestDto,
} from 'pai-shared-types';

export class CreateProfileRequestDto implements ICreateProfileRequestDto {
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
  @IsNumber()
  avatarMediaId?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;

  @IsOptional()
  @IsNumber()
  voiceMediaId?: number;
}
