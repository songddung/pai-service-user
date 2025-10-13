import { Controller, Post, Body, Inject, Request } from '@nestjs/common';
import type {
  BaseResponse,
  CreateProfileRequestDto,
  CreateProfileResponseData,
} from 'pai-shared-types';
import type { CreateProfileUseCase } from 'src/application/port/in/create-profile.use-case';
import { CreateProfileCommand } from 'src/application/port/in/create-profile.use-case';

@Controller('api/profiles')
export class CreateProfileController {
  constructor(
    @Inject('CreateProfileUseCase')
    private readonly createProfileUseCase: CreateProfileUseCase,
  ) {}

  @Post()
  async createProfile(
    @Body() dto: CreateProfileRequestDto,
    @Request() req: any, // TODO: JWT Guard로 userId 추출
  ): Promise<BaseResponse<CreateProfileResponseData>> {
    // TODO: JWT에서 userId 가져오기 (지금은 임시로 body에서)
    const userId = req.user?.userId || 1; // 임시

    const command = new CreateProfileCommand(
      userId,
      dto.profileType,
      dto.name,
      dto.birthDate,
      dto.gender,
      dto.avatarMediaId,
      dto.pin,
      dto.voiceMediaId,
    );

    const data = await this.createProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 생성 성공',
      data,
    };
  }
}
