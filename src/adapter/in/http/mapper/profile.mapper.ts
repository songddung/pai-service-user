import { Injectable } from '@nestjs/common';
import type {
  CreateProfileRequestDto,
  CreateProfileResponseData,
  DeleteProfileResponseData,
  GetProfileRequestDto,
  GetProfilesResponseData,
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
      dto.avatarMediaId ? dto.avatarMediaId : undefined,
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
      avatarMediaId: result.avatarMediaId ?? undefined,
    };
  }

  // 전체 프로필 조회
  toGetProfileCommand(
    dto: GetProfileRequestDto,
    userId: number,
  ): GetProfileCommand {
    return new GetProfileCommand(userId, dto.profileType);
  }

  toGetProfileResponse(result: GetProfilesResult): GetProfilesResponseData {
    return {
      profiles: result.profiles.map((profile) => ({
        profileId: String(profile.getId()),
        profileType: profile.getProfileType(),
        name: profile.getName(),
        birthDate: profile.getBirthDate().toISOString().split('T')[0],
        gender: profile.getGender() ?? '',
        avatarMediaId: profile.getAvatarMediaId()?.toString(),
        voiceMediaId: profile.getVoiceMediaId(),
        createdAt: profile.getCreatedAt()?.toISOString() ?? '',
      })),
    };
  }

  // 프로필 선택
  toSelectCommand(
    dto: SelectProfileRequestDto,
    userId: number,
  ): SelectProfileCommand {
    return new SelectProfileCommand(
      userId,
      Number(dto.profileId),
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
      dto.avatarMediaId ? dto.avatarMediaId : undefined,
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
      avatarMediaId: result.avatarMediaId,
      voiceMediaId: result.voiceMediaId,
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
}
