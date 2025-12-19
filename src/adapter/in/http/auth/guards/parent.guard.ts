import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { verifyAccessToken, type AuthClaims } from '../token.verifier';
import type { TokenVersionQueryPort } from 'src/application/port/out/token-version.query.port';
import { USER_TOKENS } from 'src/user.token';
import type { Request } from 'express';

@Injectable()
export class ParentGuard implements CanActivate {
  constructor(
    @Inject(USER_TOKENS.TokenVersionQueryPort)
    private readonly tokenVersionQuery: TokenVersionQueryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // HTTP 요청 객체 가져오기
    const req = context.switchToHttp().getRequest<Request>();

    // 1) Bearer 토큰 추출
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('UNAUTHORIZED: Bearer token required');
    }
    const token = authHeader.slice('Bearer '.length).trim();

    // 2) 서명/만료 검증 + 클레임 추출
    let claims: AuthClaims;
    try {
      claims = await verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException('UNAUTHORIZED: invalid or expired token');
    }

    // 3) 필요한 클레임 확인
    const userId = claims.sub;
    const profileId = claims.profileId;
    const profileType = claims.profileType;

    if (!userId)
      throw new UnauthorizedException('UNAUTHORIZED: sub(userId) missing');
    if (!profileId)
      throw new BadRequestException('VALIDATION_ERROR: profileId missing');
    if (profileType !== 'parent')
      throw new ForbiddenException('FORBIDDEN: parent profile required');

    // 4) Token Version 검증 (무효화된 토큰 차단)
    // 모든 토큰은 tokenVersion과 deviceId를 가져야 함
    const tokenVersion = claims.tokenVersion;
    if (tokenVersion === undefined) {
      throw new UnauthorizedException('UNAUTHORIZED: token version missing');
    }

    const deviceId = claims.deviceId;
    if (!deviceId) {
      throw new UnauthorizedException(
        'UNAUTHORIZED: deviceId missing in token',
      );
    }

    const currentVersion = await this.tokenVersionQuery.getDeviceVersion(
      Number(userId),
      deviceId,
    );
    if (tokenVersion !== currentVersion) {
      throw new UnauthorizedException(
        'UNAUTHORIZED: token has been revoked (version mismatch)',
      );
    }

    // 5) 쓰기 쉽게 저장
    req.auth = {
      token,
      userId,
      profileId,
      profileType: 'parent',
      claims,
    };

    return true;
  }
}
