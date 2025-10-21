import {
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { UpdateProfileRequestDto as IUpdateProfileRequestDto } from 'pai-shared-types';

export class UpdateProfileRequestDto implements IUpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'birthDate must be a valid date string (YYYY-MM-DD)' },
  )
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  avatarMediaId?: number;

  @IsOptional()
  @IsNumber()
  voiceMediaId?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;
}
