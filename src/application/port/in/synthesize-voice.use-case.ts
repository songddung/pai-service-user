import { SynthesizeVoiceCommand } from 'src/application/command/synthesize-voice.command';

export interface SynthesizeVoiceUseCase {
  execute(command: SynthesizeVoiceCommand): Promise<Buffer>;
}
