import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  SelectProfileRequestDto,
  SelectProfileResponseData,
} from 'pai-shared-types';
import type { SelectProfileUseCase } from 'src/application/port/in/select-profile.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ProfileMapper } from '../../../../mapper/profile.mapper';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class SelectProfileController {
  constructor(
    @Inject(USER_TOKENS.SelectProfileUseCase)
    private readonly selectProfileUseCase: SelectProfileUseCase,
    private readonly profileMapper: ProfileMapper,
  ) {}

  @Post('select')
  async selectProfile(
    @Body() dto: SelectProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<SelectProfileResponseData>> {
    const command = this.profileMapper.toSelectCommand(dto, userId);
    const result = await this.selectProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 선택 성공',
      data: result,
    };
  }
}
