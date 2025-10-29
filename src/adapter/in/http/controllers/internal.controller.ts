import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import type { TokenVersionQueryPort } from 'src/application/port/out/token-version.query.port';
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
}
