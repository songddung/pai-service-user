import { Injectable } from '@nestjs/common';
import type { SignupRequestDto, SignupResponseData } from 'pai-shared-types';
import { SignupCommand } from '../application/command/signup.command';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 * - 외부 계약 변경의 파급을 여기서 흡수
 * - Controller는 얇게 유지
 */
@Injectable()
export class SignupMapper {
  toCommand(dto: SignupRequestDto): SignupCommand {
    return new SignupCommand(
      String(dto.email ?? '').trim().toLowerCase(),
      String(dto.password ?? ''),
      String(dto.address ?? '').trim(),
    );
  }

  toResponse(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): SignupResponseData {
    return {
      userId,
      accessToken,
      refreshToken,
    };
  }
}
