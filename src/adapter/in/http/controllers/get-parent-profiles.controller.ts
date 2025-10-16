import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  GetParentProfilesResponseData,
} from 'pai-shared-types';
import type { GetParentProfilesUseCase } from 'src/application/port/in/get-parent-profiles.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { GetProfilesMapper } from '../../../../mapper/get-profiles.mapper';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class GetParentProfilesController {
  constructor(
    @Inject(USER_TOKENS.GetParentProfilesUseCase)
    private readonly getParentProfilesUseCase: GetParentProfilesUseCase,
    private readonly getProfilesMapper: GetProfilesMapper,
  ) {}

  @Get('parent')
  async getParentProfiles(
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<GetParentProfilesResponseData>> {
    const query = this.getProfilesMapper.toQuery(userId);
    const result = await this.getParentProfilesUseCase.execute(query);

    return {
      success: true,
      message: '부모 프로필 조회 성공',
      data: result,
    };
  }
}
