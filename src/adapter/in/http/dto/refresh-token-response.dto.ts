import { RefreshTokenResult } from 'pai-shared-types';

export class RefreshTokenResponseDto implements RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}
