import { ElevenLabs } from '@elevenlabs/elevenlabs-js';
import { CreateVoiceResult } from '../in/result/create-voice.result.dto';

export interface ElevenLabsUseCase {
  createVoice(
    name: string,
    files: Express.Multer.File[],
  ): Promise<CreateVoiceResult>;

  deleteVoice(voiceId: string): Promise<void>;

  getVoice(voiceId: string): Promise<ElevenLabs.Voice>;

  synthesize(voiceId: string, text: string): Promise<Buffer>;
}
