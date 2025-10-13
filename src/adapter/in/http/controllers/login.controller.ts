import { Body, Controller, Inject, Post } from '@nestjs/common';
import type {
  BaseResponse,
  LoginRequestDto,
  LoginResponseData,
} from 'pai-shared-types';
import { LoginCommand } from 'src/application/command/login.command';
import type { LoginUseCase } from 'src/application/port/in/login.use-case';

@Controller('api/auth')
export class LoginController {
  constructor(
    @Inject('LoginUseCase')
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<BaseResponse<LoginResponseData>> {
    const command = new LoginCommand(loginDto.email, loginDto.password);
    const data = await this.loginUseCase.execute(command);

    return {
      success: true,
      message: '로그인 성공',
      data,
    };
  }
}
