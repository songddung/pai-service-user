import { Injectable } from '@nestjs/common';
import type {
  CreateProfileRequestDto,
  CreateProfileResponseData,
} from 'pai-shared-types';
import { CreateProfileCommand } from '../application/port/in/create-profile.use-case';

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
}
