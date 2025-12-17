import { CreateVoiceCommand } from 'src/application/command/create-voice.command';
import { CreateVoiceResult } from './result/create-voice.result.dto';

export interface CreateVoiceUseCase {
  execute(command: CreateVoiceCommand): Promise<CreateVoiceResult>;
}
