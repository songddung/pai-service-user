import { Injectable } from '@nestjs/common';
import type {
  CreateProfileRequestDto,
  CreateProfileResponseData,
  ProfileDto,
} from 'pai-shared-types';
import { Profile } from '../domain/model/profile/profile.entity';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 */
@Injectable()
export class ProfileMapper {
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
      dto.avatarMediaId,
      dto.pin ? String(dto.pin).trim() : undefined,
      dto.voiceMediaId,
    );
  }

  toCreateResponse(
    profileId: number,
    userId: number,
    profileType: string,
    name: string,
    accessToken: string,
    refreshToken: string,
  ): CreateProfileResponseData {
    return {
      profileId,
      userId,
      profileType,
      name,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Profile 엔티티를 ProfileDto로 변환
   */
  toDto(profile: Profile): ProfileDto {
    return {
      profileId: profile.getId(),
      profileType: profile.getProfileType(),
      name: profile.getName(),
      birthDate: profile.getBirthDate().toISOString().split('T')[0],
      gender: profile.getGender() || '',
      avatarMediaId: profile.getAvatarMediaId(),
      voiceMediaId: profile.getVoiceMediaId(),
      createdAt: profile.getCreatedAt()?.toISOString() || '',
    };
  }

  /**
   * Profile 엔티티 배열을 ProfileDto 배열로 변환
   */
  toDtoList(profiles: Profile[]): ProfileDto[] {
    return profiles.map((profile) => this.toDto(profile));
  }

  toSelectCommand(
    dto: SelectProfileRequestDto,
    userId: number,
  ): SelectProfileCommand {
    return new SelectProfileCommand(userId, Number(dto.profileId));
  }

  // Prisma 객체 기준으로 수정, SelectProfileResponseData 타입과 정확히 일치
  toSelectResponse(
    profile: Profile,
    accessToken: string,
    refreshToken: string,
  ): SelectProfileResponseData {
    return {
      profileId: Number(profile.getId()),
      userId: Number(profile.getUserId()),
      profileType: profile.getProfileType(),
      accessToken,
      refreshToken,
    };
  }
}
