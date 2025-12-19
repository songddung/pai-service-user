import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type {
  MediaInfo,
  MediaServicePort,
} from 'src/application/port/out/media-service.port';

@Injectable()
export class MediaServiceAdapter implements MediaServicePort {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.MEDIA_SERVICE_URL || 'http://localhost:3002';
  }

  async getMediaByIds(mediaIds: bigint[]): Promise<MediaInfo[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/internal/media`, {
        params: {
          mediaIds: mediaIds.map((id) => String(id)).join(','),
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch media from media service:', error);
      return [];
    }
  }
}
