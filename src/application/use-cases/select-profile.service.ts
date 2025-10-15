import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { SelectProfileResponseData } from 'pai-shared-types';
import {
  SelectProfileUseCase,
} from 'src/application/port/in/select-profile.use-case';
import { SelectProfileCommand } from 'src/application/command/select-profile.command';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import type { TokenProvider } from 'src/application/port/out/token.provider';
import type { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';
import { USER_TOKENS } from '../../user.token';

@Injectable()
export class SelectProfileService implements SelectProfileUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQuery: ProfileQueryPort,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(
    command: SelectProfileCommand,
  ): Promise<SelectProfileResponseData> {
    // 1) 프로필 존재 여부 확인
    const profile = await this.profileQuery.findById(command.profileId);
    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    // 2) 프로필이 해당 사용자의 것인지 확인
    if (profile.getUserId() !== command.userId) {
      throw new NotFoundException('접근 권한이 없는 프로필입니다.');
    }

    // 3) 부모 프로필인 경우 PIN 검증
    if (profile.getProfileType() === 'parent') {
      if (!command.pin) {
        throw new BadRequestException('부모 프로필 선택 시 PIN이 필요합니다.');
      }

      const pinHash = profile.getPinHash();
      if (!pinHash) {
        throw new BadRequestException('프로필에 PIN이 설정되지 않았습니다.');
      }

      const isPinValid = await bcrypt.compare(command.pin, pinHash);
      if (!isPinValid) {
        throw new UnauthorizedException('PIN이 일치하지 않습니다.');
      }
    }

    // 4) 프로필 정보로 새 토큰 발급
    const tokenPair = await this.tokenProvider.generateProfileTokenPair(
      command.userId,
      profile.getId(),
      profile.getProfileType(),
    );

    // 5) Redis에 RefreshToken 업데이트 (7일 TTL)
    await this.refreshTokenRepository.save(
      command.userId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    // 6) 결과 반환
    return {
      userId: command.userId,
      profileId: profile.getId(),
      profileType: profile.getProfileType(),
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
