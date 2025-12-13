import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { SelectProfileRequestDto as ISelectProfileRequestDto } from 'pai-shared-types';

export class SelectProfileRequestDto implements ISelectProfileRequestDto {
  @IsString()
  profileId: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;
}
