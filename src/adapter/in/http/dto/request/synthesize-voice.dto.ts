import { IsString } from 'class-validator';
import { SynthesizeVoiceRequestDto as ISynthesizeVoiceDto } from 'pai-shared-types';
export class SynthesizeVoiceRequestDto implements ISynthesizeVoiceDto {
  @IsString()
  text: string;
}
