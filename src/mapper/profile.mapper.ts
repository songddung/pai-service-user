import { Injectable } from '@nestjs/common';
import type {
  CreateProfileRequestDto,
  CreateProfileResponseData,
  ProfileDto,
} from 'pai-shared-types';
import { CreateProfileCommand } from '../application/port/in/create-profile.use-case';
import { Profile } from '../domain/model/profile/profile.entity';

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
}
