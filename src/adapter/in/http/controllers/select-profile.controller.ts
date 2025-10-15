import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  SelectProfileRequestDto,
  SelectProfileResponseData,
} from 'pai-shared-types';
import type { SelectProfileUseCase } from 'src/application/port/in/select-profile.use-case';
import { SelectProfileCommand } from 'src/application/command/select-profile.command';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class SelectProfileController {
  constructor(
    @Inject(USER_TOKENS.SelectProfileUseCase)
    private readonly selectProfileUseCase: SelectProfileUseCase,
  ) {}

  @Post('select')
  async selectProfile(
    @Body() dto: SelectProfileRequestDto,
    @Auth('userId') userId: string,
  ): Promise<BaseResponse<SelectProfileResponseData>> {
    const command = new SelectProfileCommand(
      Number(userId),
      dto.profileId,
      dto.pin,
    );
    const result = await this.selectProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 선택 성공',
      data: result,
    };
  }
}
