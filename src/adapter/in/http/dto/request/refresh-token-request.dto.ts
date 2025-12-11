import { IsString } from 'class-validator';
import type { RefreshTokenRequestDto as IRefreshTokenRequestDto } from 'pai-shared-types';

export class RefreshTokenRequestDto implements IRefreshTokenRequestDto {
  @IsString()
  refreshToken: string;

  @IsString()
  deviceId: string;
}
