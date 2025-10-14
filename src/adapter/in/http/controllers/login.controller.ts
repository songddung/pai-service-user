import { Body, Controller, Inject, Post } from '@nestjs/common';
import type {
  BaseResponse,
  LoginRequestDto,
  LoginResponseData,
} from 'pai-shared-types';
import type { LoginUseCase } from 'src/application/port/in/login.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { LoginMapper } from '../../../../mapper/login.mapper';

@Controller('api/auth')
export class LoginController {
  constructor(
    @Inject(USER_TOKENS.LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    private readonly loginMapper: LoginMapper,
  ) {}

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
}
