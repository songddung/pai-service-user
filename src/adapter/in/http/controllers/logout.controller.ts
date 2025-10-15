import { Controller, Post, Inject, UseGuards } from '@nestjs/common';
import type { BaseResponse } from 'pai-shared-types';
import type { LogoutUseCase } from 'src/application/port/in/logout.use-case';
import { LogoutCommand } from 'src/application/command/logout.command';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/auth')
export class LogoutController {
  constructor(
    @Inject(USER_TOKENS.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('logout')
  async logout(
    @Auth('userId') userId: string,
  ): Promise<BaseResponse<null>> {
    const command = new LogoutCommand(Number(userId));
    await this.logoutUseCase.execute(command);

    return {
      success: true,
      message: '로그아웃 성공',
      data: null,
    };
  }
}
