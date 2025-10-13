import { Controller, Post, Body, Inject } from '@nestjs/common';
import type { BaseResponse } from 'pai-shared-types';
import type { CheckEmailDuplicateUseCase } from 'src/application/port/in/check-email-duplicate.use-case';
import { CheckEmailDto } from '../dto/check-email.dto';

@Controller('api/auth')
export class CheckEmailController {
  constructor(
    @Inject('CheckEmailDuplicateUseCase')
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
}
