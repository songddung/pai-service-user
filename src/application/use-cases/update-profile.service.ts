import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UpdateProfileUseCase } from 'src/application/port/in/update-profile.use-case';
import { UpdateProfileCommand } from 'src/application/command/update-profile.command';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import type { ProfileRepositoryPort } from 'src/application/port/out/profile.repository.port';
import { USER_TOKENS } from '../../user.token';
import { Profile } from 'src/domain/model/profile/entity/profile.entity';

@Injectable()
export class UpdateProfileService implements UpdateProfileUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQuery: ProfileQueryPort,

    @Inject(USER_TOKENS.ProfileRepositoryPort)
    private readonly profileRepository: ProfileRepositoryPort,
  ) {}

  async execute(
    command: UpdateProfileCommand,
  ): Promise<UpdateProfileResponseVO> {
    // 1) 프로필 존재 여부 확인
    const profile = await this.profileQuery.findById(command.profileId);
    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    // 2) 프로필이 해당 사용자의 것인지 확인
    if (profile.getUserId() !== command.userId) {
      throw new ForbiddenException('해당 프로필을 수정할 권한이 없습니다.');
    }

    // 3) 업데이트 가능한 필드 수정
    if (command.name !== undefined) {
      profile.updateName(command.name);
    }

    if (command.avatarMediaId !== undefined) {
      profile.updateAvatar(command.avatarMediaId);
    }

    // 4) PIN 업데이트 (부모 프로필만)
    if (command.pin !== undefined) {
      // PIN 검증
      Profile.validatePin(command.pin);

      // PIN 해싱 후 업데이트
      const pinHash = await bcrypt.hash(command.pin, 10);
      profile.updatePin(pinHash);
    }

    // 5) 업데이트
    const updated = await this.profileRepository.update(profile);

    // 6) 결과 반환
    return {
      profileId: updated.getId(),
      userId: updated.getUserId(),
      profileType: updated.getProfileType(),
      name: updated.getName(),
      birthDate: updated.getBirthDate().toISOString().split('T')[0],
      gender: updated.getGender() || '',
      avatarMediaId: updated.getAvatarMediaId()
        ? updated.getAvatarMediaId()
        : undefined,
      voiceMediaId: updated.getVoiceMediaId()
        ? updated.getVoiceMediaId()
        : undefined,
    };
  }
}
