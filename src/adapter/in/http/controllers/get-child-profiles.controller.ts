import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  GetChildProfilesResponseData,
} from 'pai-shared-types';
import type { GetChildProfilesUseCase } from 'src/application/port/in/get-child-profiles.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class GetChildProfilesController {
  constructor(
    @Inject(USER_TOKENS.GetChildProfilesUseCase)
    private readonly getChildProfilesUseCase: GetChildProfilesUseCase,
  ) {}

  @Get('child')
  async getChildProfiles(
    @Auth('userId') userId: string,
  ): Promise<BaseResponse<GetChildProfilesResponseData>> {
    const result = await this.getChildProfilesUseCase.execute({
      userId: Number(userId),
    });

    return {
      success: true,
      message: '아이 프로필 조회 성공',
      data: result,
    };
  }
}
