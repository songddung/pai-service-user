import {
  Controller,
  Body,
  Param,
  Inject,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import type {
  BaseResponse,
  UpdateProfileRequestDto,
  UpdateProfileResponseData,
} from 'pai-shared-types';
import type { UpdateProfileUseCase } from 'src/application/port/in/update-profile.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ProfileMapper } from '../../../../mapper/profile.mapper';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class UpdateProfileController {
  constructor(
    @Inject(USER_TOKENS.UpdateProfileUseCase)
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly profileMapper: ProfileMapper,
  ) {}

  @Patch(':profileId')
  async updateProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() dto: UpdateProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<UpdateProfileResponseData>> {
    const command = this.profileMapper.toUpdateCommand(profileId, userId, dto);
    const result = await this.updateProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 수정 성공',
      data: result,
    };
  }
}
