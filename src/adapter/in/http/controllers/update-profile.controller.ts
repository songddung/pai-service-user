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
import { UpdateProfileCommand } from 'src/application/command/update-profile.command';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class UpdateProfileController {
  constructor(
    @Inject(USER_TOKENS.UpdateProfileUseCase)
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Patch(':profileId')
  async updateProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() dto: UpdateProfileRequestDto,
    @Auth('userId') userId: string,
  ): Promise<BaseResponse<UpdateProfileResponseData>> {
    const command = new UpdateProfileCommand(
      Number(userId),
      profileId,
      dto.name,
      dto.birthDate,
      dto.gender,
      dto.avatarMediaId,
      dto.voiceMediaId,
      dto.pin,
    );
    const result = await this.updateProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 수정 성공',
      data: result,
    };
  }
}
