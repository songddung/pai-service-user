import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import type { BaseResponse } from 'pai-shared-types';
import type { RefreshTokenUseCase } from 'src/application/port/in/refresh-token.use-case';
import { RefreshTokenCommand } from 'src/application/command/refresh-token.command';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/auth')
export class RefreshTokenController {
  constructor(
    @Inject(USER_TOKENS.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('refresh')
  async refresh(
    @Auth('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ): Promise<BaseResponse<{ accessToken: string; refreshToken: string }>> {
    const command = new RefreshTokenCommand(Number(userId), refreshToken);
    const result = await this.refreshTokenUseCase.execute(command);

    return {
      success: true,
      message: '토큰 재발급 성공',
      data: result,
    };
  }
}
