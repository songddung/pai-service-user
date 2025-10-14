import { Controller, Post, Body, Inject } from '@nestjs/common';
import type {
  SignupRequestDto,
  SignupResponseData,
  BaseResponse,
} from 'pai-shared-types';
import type { SignupUseCase } from 'src/application/port/in/signup.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { SignupMapper } from '../../../../mapper/signup.mapper';

@Controller('api/auth')
export class SignupController {
  constructor(
    @Inject(USER_TOKENS.SignupUseCase)
    private readonly signupUseCase: SignupUseCase,
    private readonly signupMapper: SignupMapper,
  ) {}

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
}
