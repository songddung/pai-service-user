import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class SelectProfileRequestDto {
  @IsString()
  profileId: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;
}
