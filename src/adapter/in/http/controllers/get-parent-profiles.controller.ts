import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  GetParentProfilesResponseData,
} from 'pai-shared-types';
import type { GetParentProfilesUseCase } from 'src/application/port/in/get-parent-profiles.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class GetParentProfilesController {
  constructor(
    @Inject(USER_TOKENS.GetParentProfilesUseCase)
    private readonly getParentProfilesUseCase: GetParentProfilesUseCase,
  ) {}

  @Get('parent')
  async getParentProfiles(
    @Auth('userId') userId: string,
  ): Promise<BaseResponse<GetParentProfilesResponseData>> {
    const result = await this.getParentProfilesUseCase.execute({
      userId: Number(userId),
    });

    return {
      success: true,
      message: '부모 프로필 조회 성공',
      data: result,
    };
  }
}
