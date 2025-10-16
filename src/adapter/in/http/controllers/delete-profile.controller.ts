import { Controller, Delete, Param, Inject, UseGuards, ParseIntPipe } from '@nestjs/common';
import type {
  BaseResponse,
  DeleteProfileResponseData,
} from 'pai-shared-types';
import type { DeleteProfileUseCase } from 'src/application/port/in/delete-profile.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ProfileMapper } from '../../../../mapper/profile.mapper';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class DeleteProfileController {
  constructor(
    @Inject(USER_TOKENS.DeleteProfileUseCase)
    private readonly deleteProfileUseCase: DeleteProfileUseCase,
    private readonly profileMapper: ProfileMapper,
  ) {}

  @Delete(':profileId')
  async deleteProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<DeleteProfileResponseData>> {
    const command = this.profileMapper.toDeleteCommand(userId, profileId);
    const result = await this.deleteProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 삭제 성공',
      data: result,
    };
  }
}
