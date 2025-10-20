import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Inject,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import type { BaseResponse } from 'pai-shared-types';
import { CreateProfileRequestDto } from '../dto/request/create-profile-request.dto';
import { UpdateProfileRequestDto } from '../dto/request/update-profile-request.dto';
import { SelectProfileRequestDto } from '../dto/request/select-profile-request.dto';
import type { CreateProfileUseCase } from 'src/application/port/in/create-profile.use-case';
import type { UpdateProfileUseCase } from 'src/application/port/in/update-profile.use-case';
import type { DeleteProfileUseCase } from 'src/application/port/in/delete-profile.use-case';
import type { SelectProfileUseCase } from 'src/application/port/in/select-profile.use-case';
import type { GetParentProfilesUseCase } from 'src/application/port/in/get-parent-profiles.use-case';
import type { GetChildProfilesUseCase } from 'src/application/port/in/get-child-profiles.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { ProfileMapper } from '../../../../mapper/profile.mapper';
import { GetProfilesMapper } from '../../../../mapper/get-profiles.mapper';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { CreateProfileResponseDto } from '../dto/reponse/create-profile-response.dto';
import { UpdateProfileResponseDto } from '../dto/reponse/update-profile-response.dto';
import { DeleteProfileResponseDto } from '../dto/reponse/delete-profile-response.dto';
import { SelectProfileResponseDto } from '../dto/reponse/select-profile-response.dto';
import {
  GetChildProfilesResponseDto,
  GetParentProfilesResponseDto,
} from '../dto/reponse/get-profiles-response.dto';

@UseGuards(BasicAuthGuard)
@Controller('api/profiles')
export class ProfileController {
  constructor(
    @Inject(USER_TOKENS.CreateProfileUseCase)
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly profileMapper: ProfileMapper,

    @Inject(USER_TOKENS.UpdateProfileUseCase)
    private readonly updateProfileUseCase: UpdateProfileUseCase,

    @Inject(USER_TOKENS.DeleteProfileUseCase)
    private readonly deleteProfileUseCase: DeleteProfileUseCase,

    @Inject(USER_TOKENS.SelectProfileUseCase)
    private readonly selectProfileUseCase: SelectProfileUseCase,

    @Inject(USER_TOKENS.GetParentProfilesUseCase)
    private readonly getParentProfilesUseCase: GetParentProfilesUseCase,
    private readonly getProfilesMapper: GetProfilesMapper,

    @Inject(USER_TOKENS.GetChildProfilesUseCase)
    private readonly getChildProfilesUseCase: GetChildProfilesUseCase,
  ) {}

  @Post()
  async createProfile(
    @Body() dto: CreateProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<CreateProfileResponseDto>> {
    const command = this.profileMapper.toCreateCommand(dto, userId);
    const result = await this.createProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 생성 성공',
      data: result,
    };
  }

  @Patch(':profileId')
  async updateProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() dto: UpdateProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<UpdateProfileResponseDto>> {
    const command = this.profileMapper.toUpdateCommand(profileId, userId, dto);
    const result = await this.updateProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 수정 성공',
      data: result,
    };
  }

  @Delete(':profileId')
  async deleteProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<DeleteProfileResponseDto>> {
    const command = this.profileMapper.toDeleteCommand(userId, profileId);
    const result = await this.deleteProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 삭제 성공',
      data: result,
    };
  }

  @Post('select')
  async selectProfile(
    @Body() dto: SelectProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<SelectProfileResponseDto>> {
    const command = this.profileMapper.toSelectCommand(dto, userId);
    const result = await this.selectProfileUseCase.execute(command);

    return {
      success: true,
      message: '프로필 선택 성공',
      data: result,
    };
  }

  @Get('parent')
  async getParentProfiles(
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<GetParentProfilesResponseDto>> {
    const query = this.getProfilesMapper.toQuery(userId);
    const result = await this.getParentProfilesUseCase.execute(query);

    return {
      success: true,
      message: '부모 프로필 조회 성공',
      data: result,
    };
  }

  @Get('child')
  async getChildProfiles(
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<GetChildProfilesResponseDto>> {
    const query = this.getProfilesMapper.toQuery(userId);
    const result = await this.getChildProfilesUseCase.execute(query);

    return {
      success: true,
      message: '아이 프로필 조회 성공',
      data: result,
    };
  }
}
