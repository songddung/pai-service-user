import { Injectable } from '@nestjs/common';
import { RefreshTokenCommand } from '../application/command/refresh-token.command';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 */
@Injectable()
export class RefreshTokenMapper {
  toCommand(userId: number, refreshToken: string): RefreshTokenCommand {
    return new RefreshTokenCommand(userId, String(refreshToken ?? '').trim());
  }
}
