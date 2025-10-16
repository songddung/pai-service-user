import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  GetChildProfilesResponseData,
} from 'pai-shared-types';
import type { GetChildProfilesUseCase } from 'src/application/port/in/get-child-profiles.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { GetProfilesMapper } from '../../../../mapper/get-profiles.mapper';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class GetChildProfilesController {
  constructor(
    @Inject(USER_TOKENS.GetChildProfilesUseCase)
    private readonly getChildProfilesUseCase: GetChildProfilesUseCase,
    private readonly getProfilesMapper: GetProfilesMapper,
  ) {}

  @Get('child')
  async getChildProfiles(
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<GetChildProfilesResponseData>> {
    const query = this.getProfilesMapper.toQuery(userId);
    const result = await this.getChildProfilesUseCase.execute(query);

    return {
      success: true,
      message: '아이 프로필 조회 성공',
      data: result,
    };
  }
}
