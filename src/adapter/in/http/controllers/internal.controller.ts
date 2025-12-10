import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import type { TokenVersionQueryPort } from 'src/application/port/out/token-version.query.port';
import type { UserQueryPort } from 'src/application/port/out/user.query.port';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import { USER_TOKENS } from 'src/user.token';

/**
 * Internal API Controller
 * - 다른 마이크로서비스에서 호출하는 내부 API
 * - 인증 없이 서비스 간 통신용
 */
@Controller('api/internal')
export class InternalController {
  constructor(
    @Inject(USER_TOKENS.TokenVersionQueryPort)
    private readonly tokenVersionQuery: TokenVersionQueryPort,

    @Inject(USER_TOKENS.UserQueryPort)
    private readonly userQuery: UserQueryPort,

    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQuery: ProfileQueryPort,
  ) {}

  /**
   * 사용자의 토큰 버전 검증
   * @param userId 사용자 ID
   * @param version 검증할 토큰 버전
   * @returns 토큰이 유효한지 여부
   */
  @Get('users/:userId/token-version/verify')
  async verifyTokenVersion(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('version', ParseIntPipe) version: number,
  ): Promise<{
    isValid: boolean;
  }> {
    const currentVersion = await this.tokenVersionQuery.getVersion(userId);

    return {
      isValid: currentVersion === version,
    };
  }

  /**
   * User 위치 정보 조회 (MSA 간 통신용)
   * @param userId 사용자 ID
   * @returns 사용자의 위치 정보
   */
  @Get('users/:userId/location')
  async getUserLocation(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{
    success: boolean;
    data: {
      userId: number;
      latitude: number;
      longitude: number;
      address: string;
    } | null;
  }> {
    const user = await this.userQuery.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const address = user.getAddress();

    return {
      success: true,
      data: {
        userId,
        latitude: address.getLatitude(),
        longitude: address.getLongitude(),
        address: address.getAddress(),
      },
    };
  }

  /**
   * Profile 정보 조회 (MSA 간 통신용)
   * @param profileId 프로필 ID
   * @returns 프로필 정보
   */
  @Get('profiles/:profileId')
  async getProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<{
    success: boolean;
    data: {
      profileId: number;
      userId: number;
      name: string;
      profileType: string;
    } | null;
  }> {
    const profile = await this.profileQuery.findById(profileId);

    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    return {
      success: true,
      data: {
        profileId: profile.getId(),
        userId: profile.getUserId(),
        name: profile.getName().getValue(),
        profileType: profile.getProfileType(),
      },
    };
  }
}
