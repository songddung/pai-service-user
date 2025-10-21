import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { SelectProfileRequestDto as ISelectProfileRequestDto } from 'pai-shared-types';

export class SelectProfileRequestDto implements ISelectProfileRequestDto {
  @IsNumber()
  profileId: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  pin?: string;
}
