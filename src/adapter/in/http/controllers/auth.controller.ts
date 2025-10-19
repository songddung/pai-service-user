import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  SignupResponseData,
  LoginResponseData,
  RefreshTokenResult,
} from 'pai-shared-types';
import { SignupRequestDto } from '../dto/signup-request.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import type { SignupUseCase } from 'src/application/port/in/signup.use-case';
import type { LoginUseCase } from 'src/application/port/in/login.use-case';
import type { LogoutUseCase } from 'src/application/port/in/logout.use-case';
import type { RefreshTokenUseCase } from 'src/application/port/in/refresh-token.use-case';
import type { CheckEmailDuplicateUseCase } from 'src/application/port/in/check-email-duplicate.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { SignupMapper } from '../../../../mapper/signup.mapper';
import { LoginMapper } from '../../../../mapper/login.mapper';
import { LogoutMapper } from '../../../../mapper/logout.mapper';
import { RefreshTokenMapper } from '../../../../mapper/refresh-token.mapper';
import { CheckEmailDto } from '../dto/check-email.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(USER_TOKENS.SignupUseCase)
    private readonly signupUseCase: SignupUseCase,
    private readonly signupMapper: SignupMapper,

    @Inject(USER_TOKENS.LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    private readonly loginMapper: LoginMapper,

    @Inject(USER_TOKENS.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutMapper: LogoutMapper,

    @Inject(USER_TOKENS.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly refreshTokenMapper: RefreshTokenMapper,

    @Inject(USER_TOKENS.CheckEmailDuplicateUseCase)
    private readonly checkEmailDuplicateUseCase: CheckEmailDuplicateUseCase,
  ) {}

  @Post('check-email')
  async checkEmail(@Body() dto: CheckEmailDto): Promise<BaseResponse<Boolean>> {
    const data = await this.checkEmailDuplicateUseCase.execute(dto.email);

    return {
      success: true,
      message: data.message,
      data: data.isAvailable,
    };
  }

  @Post('signup')
  async signup(
    @Body() dto: SignupRequestDto,
  ): Promise<BaseResponse<SignupResponseData>> {
    const command = this.signupMapper.toCommand(dto);
    const result = await this.signupUseCase.execute(command);

    return {
      success: true,
      message: '회원가입 성공',
      data: result,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<BaseResponse<LoginResponseData>> {
    const command = this.loginMapper.toCommand(dto);
    const result = await this.loginUseCase.execute(command);

    return {
      success: true,
      message: '로그인 성공',
      data: result,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Post('logout')
  async logout(
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<null>> {
    const command = this.logoutMapper.toCommand(userId);
    await this.logoutUseCase.execute(command);

    return {
      success: true,
      message: '로그아웃 성공',
      data: null,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Post('refresh')
  async refresh(
    @Auth('userId') userId: number,
    @Body('refreshToken') refreshToken: string,
  ): Promise<BaseResponse<RefreshTokenResult>> {
    const command = this.refreshTokenMapper.toCommand(userId, refreshToken);
    const result = await this.refreshTokenUseCase.execute(command);

    return {
      success: true,
      message: '토큰 재발급 성공',
      data: result,
    };
  }
}
