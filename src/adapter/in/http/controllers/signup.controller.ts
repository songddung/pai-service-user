import { Controller, Post, Body, Inject } from '@nestjs/common';
import type {
  SignupRequestDto,
  SignupResponseData,
  BaseResponse,
} from 'pai-shared-types';
import type { SignupUseCase } from 'src/application/port/in/signup.use-case';

@Controller('api/auth')
export class SignupController {
  constructor(
    @Inject('SignupUseCase')
    private readonly signupUseCase: SignupUseCase,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupRequestDto,
  ): Promise<BaseResponse<SignupResponseData>> {
    const data = await this.signupUseCase.execute(dto);

    return {
      success: true,
      message: '회원가입 성공',
      data,
    };
  }
}
