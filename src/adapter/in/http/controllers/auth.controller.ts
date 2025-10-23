import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  SignupResponseData,
  LoginResponseData,
  RefreshTokenResponseData,
} from 'pai-shared-types';
import { SignupRequestDto } from '../dto/request/signup-request.dto';
import { LoginRequestDto } from '../dto/request/login-request.dto';
import type { SignupUseCase } from 'src/application/port/in/signup.use-case';
import type { LoginUseCase } from 'src/application/port/in/login.use-case';
import type { LogoutUseCase } from 'src/application/port/in/logout.use-case';
import type { RefreshTokenUseCase } from 'src/application/port/in/refresh-token.use-case';
import type { CheckEmailDuplicateUseCase } from 'src/application/port/in/check-email-duplicate.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { CheckEmailDto } from '../dto/request/check-email.dto';
import { AuthMapper } from 'src/mapper/auth.mapper';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(USER_TOKENS.SignupUseCase)
    private readonly signupUseCase: SignupUseCase,
    private readonly authMapper: AuthMapper,

    @Inject(USER_TOKENS.LoginUseCase)
    private readonly loginUseCase: LoginUseCase,

    @Inject(USER_TOKENS.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,

    @Inject(USER_TOKENS.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,

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
    const command = this.authMapper.toSignupCommand(dto);
    const vo = await this.signupUseCase.execute(command);
    const response = this.authMapper.toSignupResponse(vo);

    return {
      success: true,
      message: '회원가입 성공',
      data: response,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<BaseResponse<LoginResponseData>> {
    const command = this.authMapper.toLoginCommand(dto);
    const vo = await this.loginUseCase.execute(command);
    const response = this.authMapper.toLoginResponse(vo);

    return {
      success: true,
      message: '로그인 성공',
      data: response,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Post('logout')
  async logout(@Auth('userId') userId: number): Promise<BaseResponse<null>> {
    const command = this.authMapper.toLogoutCommand(userId);
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
  ): Promise<BaseResponse<RefreshTokenResponseData>> {
    const command = this.authMapper.toTokenCommand(userId, refreshToken);
    const vo = await this.refreshTokenUseCase.execute(command);
    const response = this.authMapper.toTokenResponse(vo);

    return {
      success: true,
      message: '토큰 재발급 성공',
      data: response,
    };
  }
}
