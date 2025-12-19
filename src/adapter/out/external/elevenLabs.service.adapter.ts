import { ElevenLabs, ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateVoiceResult } from '../../../application/port/in/result/create-voice.result.dto';
import { ElevenLabsUseCase } from 'src/application/port/out/elevenLabs.use-case';

@Injectable()
export class ElevenLabsService implements ElevenLabsUseCase {
  private client: ElevenLabsClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
    if (!apiKey) {
      throw new Error('not found api_key');
    }
    this.client = new ElevenLabsClient({ apiKey });
  }

  async createVoice(
    name: string,
    files: Express.Multer.File[],
  ): Promise<CreateVoiceResult> {
    try {
      const fileObjects = files.map(
        (file) =>
          new File([new Uint8Array(file.buffer)], file.originalname, {
            type: file.mimetype,
          }),
      );

      const voice = await this.client.voices.ivc.create({
        name,
        files: fileObjects,
        description: '사용자 등록 음성',
      });

      return {
        voiceId: voice.voiceId,
      };
    } catch (error) {
      throw new Error('돈돈아 등록이 안됐다', error);
    }
  }

  // 프로필 음성 삭제
  async deleteVoice(voiceId: string): Promise<void> {
    try {
      await this.client.voices.delete(voiceId);
    } catch (error) {
      throw new Error('삭제가 안됐다.', error);
    }
  }

  // 프로필 음성 조회
  async getVoice(voiceId: string): Promise<ElevenLabs.Voice> {
    try {
      return await this.client.voices.get(voiceId);
    } catch {
      throw new Error('Voice not found');
    }
  }

  //TTS 요청
  async synthesize(voiceId: string, text: string): Promise<Buffer> {
    try {
      const audio = await this.client.textToSpeech.convert(voiceId, {
        text: text,
        modelId: 'eleven_multilingual_v2',
      });

      // Stream을 Buffer로 변환
      const chunks: Uint8Array[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      throw new Error('음성 합성 실패', error);
    }
  }
}
