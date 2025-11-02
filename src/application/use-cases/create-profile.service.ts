// src/application/use-cases/create-profile.service.ts

import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import type { CreateProfileUseCase } from 'src/application/port/in/create-profile.use-case';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';
import type { ProfileRepositoryPort } from 'src/application/port/out/profile.repository.port';
import type { TokenVersionRepositoryPort } from 'src/application/port/out/token-version.repository.port';
import type { TokenProvider } from 'src/application/port/out/token.provider';
import type { PasswordHasher } from 'src/application/port/out/password-hasher';
import { Profile } from 'src/domain/model/profile/entity/profile.entity';
import { ProfileName } from 'src/domain/model/profile/vo/profile-name.vo';
import { BirthDate } from 'src/domain/model/profile/vo/birth-date.vo';
import { Gender } from 'src/domain/model/profile/vo/gender.vo';
import { PinHash } from 'src/domain/model/profile/vo/pin-hash.vo';
import { USER_TOKENS } from '../../user.token';
import { CreateProfileResult } from '../port/in/result/create-profiile.result.dto';

@Injectable()
export class CreateProfileService implements CreateProfileUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileRepositoryPort)
    private readonly profileRepository: ProfileRepositoryPort,

    @Inject(USER_TOKENS.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: CreateProfileCommand): Promise<CreateProfileResult> {
    // 1) VO 생성
    const nameVO = ProfileName.create(command.name);
    const birthDateVO = BirthDate.create(new Date(command.birthDate));
    const genderVO = Gender.create(command.gender);

    // 2) parent인 경우 PIN 해싱
    let pinHashVO: PinHash | undefined;
    if (command.profileType === 'parent') {
      if (!command.pin) {
        throw new BadRequestException('부모 프로필은 PIN이 필수입니다.');
      }
      // PIN 형식 검증 (4-6자리 숫자)
      if (!/^\d{4,6}$/.test(command.pin)) {
        throw new BadRequestException('PIN은 4-6자리 숫자여야 합니다.');
      }
      const hashedPin = await this.passwordHasher.hash(command.pin);
      pinHashVO = PinHash.create(hashedPin);
    }

    // 3) Profile 엔티티 생성
    const profile = Profile.create({
      userId: command.userId,
      profileType: command.profileType,
      name: nameVO,
      birthDate: birthDateVO,
      gender: genderVO,
      avatarMediaId: command.avatarMediaId,
      pinHash: pinHashVO,
    });

    // 4) 저장
    const saved = await this.profileRepository.save(profile);

    // 5) 결과 반환
    return {
      userId: command.userId,
      profileId: saved.getId(),
      profileType: saved.getProfileType(),
      name: saved.getName().getValue(),
      birthDate: saved.getBirthDate().getValue().toISOString().split('T')[0],
      gender: saved.getGender().getValue(),
      avatarMediaId: saved.getAvatarMediaId(),
    };
  }
}
