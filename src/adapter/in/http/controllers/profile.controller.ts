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
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type {
  BaseResponse,
  CreateProfileResponseData,
  CreateVoiceResponseData,
  DeleteProfileResponseData,
  GetProfileResponseData,
  GetProfilesResponseData,
  SelectProfileResponseData,
  UpdateProfileResponseData,
} from 'pai-shared-types';
import { CreateProfileRequestDto } from '../dto/request/create-profile-request.dto';
import { UpdateProfileRequestDto } from '../dto/request/update-profile-request.dto';
import { SelectProfileRequestDto } from '../dto/request/select-profile-request.dto';
import type { CreateProfileUseCase } from 'src/application/port/in/create-profile.use-case';
import type { UpdateProfileUseCase } from 'src/application/port/in/update-profile.use-case';
import type { DeleteProfileUseCase } from 'src/application/port/in/delete-profile.use-case';
import type { SelectProfileUseCase } from 'src/application/port/in/select-profile.use-case';
import { USER_TOKENS } from '../../../../user.token';
import { ProfileMapper } from '../mapper/profile.mapper';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import type { GetProfilesUseCase } from 'src/application/port/in/get-profiles.use-case';
import type { GetProfileType } from 'src/domain/model/profile/enum/profile-type';
import type { GetProfileIdUseCase } from 'src/application/port/in/get-profileId.use-case';
import { CreateVoiceRequestDto } from '../dto/request/create-voice-request.dto';
import { CreateVoiceService } from 'src/application/use-cases/create-voice.service';

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

    @Inject(USER_TOKENS.GetProfilesUseCase)
    private readonly getProfilesUseCase: GetProfilesUseCase,

    @Inject(USER_TOKENS.GetProfileIdUseCase)
    private readonly getProfileIdUseCase: GetProfileIdUseCase,

    @Inject(USER_TOKENS.CreateVoiceUseCase)
    private readonly createVoiceUseCase: CreateVoiceService,
  ) {}

  @Post()
  async createProfile(
    @Body() dto: CreateProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<CreateProfileResponseData>> {
    const command = this.profileMapper.toCreateCommand(dto, userId);
    const result = await this.createProfileUseCase.execute(command);
    const response = this.profileMapper.toCreateResponse(result);

    return {
      success: true,
      message: '프로필 생성 성공',
      data: response,
    };
  }

  @Patch(':profileId')
  async updateProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() dto: UpdateProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<UpdateProfileResponseData>> {
    const command = this.profileMapper.toUpdateCommand(profileId, userId, dto);
    const result = await this.updateProfileUseCase.execute(command);
    const response = this.profileMapper.toUpdateResponse(result);

    return {
      success: true,
      message: '프로필 수정 성공',
      data: response,
    };
  }

  @Delete(':profileId')
  async deleteProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<DeleteProfileResponseData>> {
    const command = this.profileMapper.toDeleteCommand(userId, profileId);
    const result = await this.deleteProfileUseCase.execute(command);
    const response = this.profileMapper.toDeleteResponse(result);

    return {
      success: true,
      message: '프로필 삭제 성공',
      data: response,
    };
  }

  @Post('select')
  async selectProfile(
    @Body() dto: SelectProfileRequestDto,
    @Auth('userId') userId: number,
  ): Promise<BaseResponse<SelectProfileResponseData>> {
    const command = this.profileMapper.toSelectCommand(dto, userId);
    const result = await this.selectProfileUseCase.execute(command);
    const response = this.profileMapper.toSelectResponse(result);

    return {
      success: true,
      message: '프로필 선택 성공',
      data: response,
    };
  }

  @Get()
  async getProfiles(
    @Auth('userId') userId: number,
    @Query('profileType') profileType: GetProfileType,
  ): Promise<BaseResponse<GetProfilesResponseData>> {
    const command = this.profileMapper.toGetProfileCommand(userId, profileType);
    const result = await this.getProfilesUseCase.execute(command);
    const response = this.profileMapper.toGetProfileResponse(result);

    return {
      success: true,
      message: '프로필 조회 성공',
      data: response,
    };
  }

  @Get(':profileId')
  async getProfileId(
    @Auth('userId') userId: number,
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<BaseResponse<GetProfileResponseData>> {
    const command = this.profileMapper.toGetProfileIdCommand(userId, profileId);
    const result = await this.getProfileIdUseCase.execute(command);
    const response = this.profileMapper.toGetProfileIdResponse(result);
    return {
      success: true,
      message: '프로필 조회 성공',
      data: response,
    };
  }

  @Patch(':profileId/voice')
  @UseInterceptors(FilesInterceptor('files'))
  async upsertProfileVoice(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() dto: CreateVoiceRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<BaseResponse<CreateVoiceResponseData>> {
    const command = this.profileMapper.toCreateVoiceCommand(
      dto,
      profileId,
      files,
    );
    const result = await this.createVoiceUseCase.execute(command);
    const response = this.profileMapper.toCreateVoiceResponse(result);
    return {
      success: true,
      message: '음성등록 성공',
      data: response,
    };
  }
}
