// src/application/use-cases/create-profile.service.ts

import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { CreateProfileUseCase } from 'src/application/port/in/create-profile.use-case';
import { CreateProfileCommand } from 'src/application/command/create-profile.command';
import type { ProfileRepositoryPort } from 'src/application/port/out/profile.repository.port';
import type { TokenVersionRepositoryPort } from 'src/application/port/out/token-version.repository.port';
import type { TokenProvider } from 'src/application/port/out/token.provider';
import { Profile } from 'src/domain/model/profile/entity/profile.entity';
import { USER_TOKENS } from '../../user.token';
import { CreateProfileResult } from '../port/in/result/create-profiile.result.dto';

@Injectable()
export class CreateProfileService implements CreateProfileUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileRepositoryPort)
    private readonly profileRepository: ProfileRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionRepositoryPort)
    private readonly tokenVersionRepository: TokenVersionRepositoryPort,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(command: CreateProfileCommand): Promise<CreateProfileResult> {
    // 1) 생년월일 형식 검증 및 변환
    const birthDate = this.parseBirthDate(command.birthDate);

    // 2) parent인 경우 PIN 해싱
    let pinHash: string | undefined;
    if (command.profileType === 'parent') {
      if (!command.pin) {
        throw new BadRequestException('부모 프로필은 PIN이 필수입니다.');
      }
      // PIN 형식 검증 (4-6자리 숫자)
      if (!/^\d{4,6}$/.test(command.pin)) {
        throw new BadRequestException('PIN은 4-6자리 숫자여야 합니다.');
      }
      pinHash = await bcrypt.hash(command.pin, 10);
    }

    // 3) Profile 엔티티 생성
    const profile = Profile.create({
      userId: command.userId,
      profileType: command.profileType,
      name: command.name,
      birthDate,
      gender: command.gender,
      avatarMediaId: command.avatarMediaId,
      pinHash,
    });

    // 4) 저장
    const saved = await this.profileRepository.save(profile);

    // 5) 결과 반환
    return {
      userId: command.userId,
      profileId: saved.getId(),
      profileType: saved.getProfileType(),
      name: saved.getName(),
      birthDate: saved.getBirthDate().toISOString().split('T')[0],
      gender: saved.getGender() ?? '',
      avatarMediaId: saved.getAvatarMediaId() ?? null,
    };
  }

  private parseBirthDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)',
      );
    }
    return date;
  }
}
