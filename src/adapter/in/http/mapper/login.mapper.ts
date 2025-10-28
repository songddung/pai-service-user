import { Injectable } from '@nestjs/common';
import type { LoginRequestDto, LoginResponseData } from 'pai-shared-types';
import { LoginCommand } from '../../../../application/command/login.command';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 */
@Injectable()
export class LoginMapper {
  toCommand(dto: LoginRequestDto): LoginCommand {
    return new LoginCommand(
      String(dto.email ?? '')
        .trim()
        .toLowerCase(),
      String(dto.password ?? ''),
    );
  }

  toResponse(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): LoginResponseData {
    return {
      userId,
      accessToken,
      refreshToken,
    };
  }
}
