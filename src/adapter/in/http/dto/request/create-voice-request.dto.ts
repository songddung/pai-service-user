import { IsString } from 'class-validator';
import type { CreateVoiceRequestDto as ICreateVoiceRequestDto } from 'pai-shared-types';
export class CreateVoiceRequestDto implements ICreateVoiceRequestDto {
  @IsString()
  name: string;
}
