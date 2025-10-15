import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import type {
  BaseResponse,
  CreateProfileRequestDto,
  CreateProfileResponseData,
} from 'pai-shared-types';
import type { CreateProfileUseCase } from 'src/application/port/in/create-profile.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { ProfileMapper } from '../../../../mapper/profile.mapper';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class CreateProfileController {
  constructor(
    @Inject(USER_TOKENS.CreateProfileUseCase)
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly profileMapper: ProfileMapper,
  ) {}

  @Post()
  async createProfile(
    @Body() dto: CreateProfileRequestDto,
    @Auth('userId') userId: string,
  ): Promise<BaseResponse<CreateProfileResponseData>> {
    const command = this.profileMapper.toCreateCommand(dto, Number(userId));
    const result = await this.createProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 생성 성공',
      data: result,
    };
  }
}
