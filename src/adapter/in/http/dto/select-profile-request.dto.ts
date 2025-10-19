import { IsInt, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class SelectProfileRequestDto {
  @IsInt()
  profileId: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;
}
