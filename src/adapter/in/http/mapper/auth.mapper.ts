import { Injectable } from '@nestjs/common';
import { SignupCommand } from '../../../../application/command/signup.command';
import { SignupRequestDto } from 'src/adapter/in/http/dto/request/signup-request.dto';
import {
  LoginResponseData,
  RefreshTokenResponseData,
  SignupResponseData,
} from 'pai-shared-types';
import { LoginRequestDto } from 'src/adapter/in/http/dto/request/login-request.dto';
import { LoginCommand } from 'src/application/command/login.command';
import { LogoutCommand } from 'src/application/command/logout.command';
import { RefreshTokenCommand } from 'src/application/command/refresh-token.command';
import { SignupResult } from 'src/application/port/in/result/signup.result.dto';
import { LoginResult } from 'src/application/port/in/result/login.result.dto';
import { RefreshTokenResult } from 'src/application/port/in/result/refresh-token.result.dto';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 * - 외부 계약 변경의 파급을 여기서 흡수
 * - Controller는 얇게 유지
 */
@Injectable()
export class AuthMapper {
  // 회원가입
  toSignupCommand(dto: SignupRequestDto): SignupCommand {
    return new SignupCommand(
      dto.email ?? ''.trim().toLowerCase(),
      dto.password ?? '',
      dto.address ?? ''.trim(),
    );
  }

  toSignupResponse(result: SignupResult): SignupResponseData {
    return {
      userId: result.userId,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  // 로그인
  toLoginCommand(dto: LoginRequestDto): LoginCommand {
    return new LoginCommand(
      dto.email ?? ''.trim().toLowerCase(),
      dto.password ?? '',
    );
  }

  toLoginResponse(result: LoginResult): LoginResponseData {
    return {
      userId: result.userId,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  // 로그아웃
  toLogoutCommand(userId: number): LogoutCommand {
    return new LogoutCommand(userId);
  }

  // 토큰 재발급
  toTokenCommand(userId: number, refreshToken: string): RefreshTokenCommand {
    return new RefreshTokenCommand(userId, String(refreshToken ?? '').trim());
  }

  toTokenResponse(result: RefreshTokenResult): RefreshTokenResponseData {
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}
