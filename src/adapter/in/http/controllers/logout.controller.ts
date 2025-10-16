import { Controller, Post, Inject, UseGuards } from '@nestjs/common';
import type { BaseResponse } from 'pai-shared-types';
import type { LogoutUseCase } from 'src/application/port/in/logout.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { LogoutMapper } from '../../../../mapper/logout.mapper';

@UseGuards(BasicAuthGuard)
@Controller('api/auth')
export class LogoutController {
  constructor(
    @Inject(USER_TOKENS.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutMapper: LogoutMapper,
  ) {}

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
}
