import { Injectable } from '@nestjs/common';
import type {
  CreateProfileRequestDto,
  CreateProfileResponseData,
  CreateVoiceResponseData,
  DeleteProfileResponseData,
  GetProfileResponseData,
  GetProfilesResponseData,
  ProfileDto,
  SelectProfileRequestDto,
  SelectProfileResponseData,
  UpdateProfileRequestDto,
  UpdateProfileResponseData,
} from 'pai-shared-types';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';
import { SelectProfileCommand } from 'src/application/command/select-profile.command';
import { UpdateProfileCommand } from 'src/application/command/update-profile.command';
import { DeleteProfileCommand } from 'src/application/command/delete-profile.command';
import { GetProfileCommand } from 'src/application/command/get-profile.command';
import { GetProfilesResult } from 'src/application/port/in/result/get-profiles.result';
import { SelectProfileResult } from 'src/application/port/in/result/select-profile.result';
import { UpdateProfileResult } from 'src/application/port/in/result/update-profile.result';
import { CreateProfileResult } from 'src/application/port/in/result/create-profiile.result.dto';
import { DeleteProfileResult } from 'src/application/port/in/result/delete-profile.result.dto';
import type { GetProfileType } from 'src/domain/model/profile/enum/profile-type';
import { GetProfileIdCommand } from 'src/application/command/get-profileId.command';
import { GetProfileIdResult } from 'src/application/port/in/result/get-profileId.result';
import { CreateVoiceRequestDto } from '../dto/request/create-voice-request.dto';
import { CreateVoiceCommand } from 'src/application/command/create-voice.command';
import { CreateVoiceResult } from 'src/application/port/in/result/create-voice.result.dto';
import { SynthesizeVoiceCommand } from 'src/application/command/synthesize-voice.command';
import { SynthesizeVoiceRequestDto } from '../dto/request/synthesize-voice.dto';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 */
@Injectable()
export class ProfileMapper {
  // 프로필 생성
  toCreateCommand(
    dto: CreateProfileRequestDto,
    userId: number,
  ): CreateProfileCommand {
    return new CreateProfileCommand(
      userId,
      dto.profileType,
      String(dto.name ?? '').trim(),
      String(dto.birthDate ?? '').trim(),
      dto.gender,
      dto.avatarMediaId ? BigInt(dto.avatarMediaId) : undefined,
      dto.pin ? String(dto.pin).trim() : undefined,
    );
  }

  toCreateResponse(result: CreateProfileResult): CreateProfileResponseData {
    return {
      profileId: result.profileId,
      userId: result.userId,
      profileType: result.profileType,
      name: result.name,
      birthDate: result.birthDate,
      gender: result.gender,
      avatarMediaId: result.avatarMediaId
        ? String(result.avatarMediaId)
        : undefined,
    };
  }

  // 단일 프로필 조회
  toGetProfileIdCommand(
    userId: number,
    profileId: number,
  ): GetProfileIdCommand {
    return new GetProfileIdCommand(userId, profileId);
  }

  toGetProfileIdResponse(result: GetProfileIdResult): GetProfileResponseData {
    const profileEntity = result.profile;
    const profileDto: ProfileDto = {
      profileId: String(profileEntity.getId()),
      userId: String(profileEntity.getUserId()),
      profileType: profileEntity.getProfileType(),
      name: profileEntity.getName().getValue(),
      birthDate: String(profileEntity.getBirthDate().getValue().toISOString()),
      gender: String(profileEntity.getGender().getValue()),
      avatarMediaId: String(profileEntity.getAvatarMediaId()),
      voiceMediaId: profileEntity.getVoiceMediaId(),
      createdAt: profileEntity.getCreatedAt()!.toISOString(),
    };
    return {
      profile: profileDto,
    };
  }

  // 전체 프로필 조회
  toGetProfileCommand(
    userId: number,
    profileType: GetProfileType,
  ): GetProfileCommand {
    return new GetProfileCommand(userId, profileType);
  }

  toGetProfileResponse(result: GetProfilesResult): GetProfilesResponseData {
    return {
      profiles: result.profiles.map((profile, index) => ({
        profileId: String(profile.getId()),
        userId: result.userId,
        profileType: profile.getProfileType(),
        name: profile.getName().getValue(),
        birthDate: profile
          .getBirthDate()
          .getValue()
          .toISOString()
          .split('T')[0],
        gender: profile.getGender().getValue(),
        avatarMediaId: profile.getAvatarMediaId()
          ? String(profile.getAvatarMediaId())
          : undefined,
        voiceMediaId: profile.getVoiceMediaId()
          ? profile.getVoiceMediaId()
          : undefined,
        createdAt: profile.getCreatedAt()?.toISOString() ?? '',
      })),
    };
  }

  // 프로필 선택
  toSelectCommand(
    dto: SelectProfileRequestDto,
    userId: number,
    deviceId: string,
  ): SelectProfileCommand {
    return new SelectProfileCommand(
      userId,
      Number(dto.profileId),
      deviceId ?? '',
      dto.pin ? String(dto.pin).trim() : undefined,
    );
  }

  toSelectResponse(result: SelectProfileResult): SelectProfileResponseData {
    return {
      profileId: String(result.profileId),
      userId: result.userId,
      profileType: result.profileType,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  // 프로필 수정
  toUpdateCommand(
    profileId: number,
    userId: number,
    dto: UpdateProfileRequestDto,
  ): UpdateProfileCommand {
    return new UpdateProfileCommand(
      userId,
      profileId,
      dto.name ? String(dto.name).trim() : undefined,
      dto.birthDate ? String(dto.birthDate).trim() : undefined,
      dto.gender,
      dto.avatarMediaId ? BigInt(dto.avatarMediaId) : undefined,
      dto.voiceMediaId ? dto.voiceMediaId : undefined,
      dto.pin ? String(dto.pin).trim() : undefined,
    );
  }

  toUpdateResponse(result: UpdateProfileResult): UpdateProfileResponseData {
    return {
      profileId: String(result.profileId),
      userId: result.userId,
      profileType: result.profileType,
      name: result.name,
      birthDate: result.birthDate,
      gender: result.gender,
      avatarMediaId: result.avatarMediaId
        ? String(result.avatarMediaId)
        : undefined,
      voiceMediaId: result.voiceMediaId ? result.voiceMediaId : undefined,
    };
  }

  // 프로필 삭제
  toDeleteCommand(userId: number, profileId: number): DeleteProfileCommand {
    return new DeleteProfileCommand(userId, profileId);
  }

  toDeleteResponse(result: DeleteProfileResult): DeleteProfileResponseData {
    return {
      profileId: String(result.profileId),
      deletedAt: result.deletedAt,
    };
  }

  // 음성 등록
  toCreateVoiceCommand(
    dto: CreateVoiceRequestDto,
    profileId: number,
    files: Express.Multer.File[],
  ): CreateVoiceCommand {
    return new CreateVoiceCommand(dto.name, profileId, files);
  }

  toCreateVoiceResponse(result: CreateVoiceResult): CreateVoiceResponseData {
    return {
      voiceId: result.voiceId,
    };
  }

  // TTS
  toSynthesizeVoiceCommand(
    dto: SynthesizeVoiceRequestDto,
    profileId: number,
  ): SynthesizeVoiceCommand {
    return new SynthesizeVoiceCommand(dto.text, profileId);
  }
}
