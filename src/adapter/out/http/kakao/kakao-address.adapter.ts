import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { KakaoAddressService } from 'src/application/port/out/kakao-address.service';
import { ConfigService } from '@nestjs/config';

interface KakaoDocument {
  x: string;
  y: string;
}

interface KakaoResponse {
  documents: KakaoDocument[];
}

@Injectable()
export class KakaoAddressAdapter implements KakaoAddressService {
  constructor(private readonly configService: ConfigService) {}

  async getLatLng(
    address: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    const apiKey = this.configService.get<string>('KAKAO_REST_API_KEY');
    if (!apiKey) {
      throw new Error('KAKAO_REST_API_KEY is not set');
    }

    const url = 'https://dapi.kakao.com/v2/local/search/address.json';

    try {
      const response = await axios.get<KakaoResponse>(url, {
        params: { query: address },
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      });

      const doc = response.data.documents?.[0];
      if (!doc) {
        return null;
      }

      return {
        latitude: parseFloat(doc.y),
        longitude: parseFloat(doc.x),
      };
    } catch (error) {
      console.error('[Kakao API Error]', error);
      return null;
    }
  }
}
