import { IsString, IsOptional, IsInt, IsDateString, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'birthDate must be a valid date string (YYYY-MM-DD)' })
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsInt()
  avatarMediaId?: number;

  @IsOptional()
  @IsInt()
  voiceMediaId?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;
}
