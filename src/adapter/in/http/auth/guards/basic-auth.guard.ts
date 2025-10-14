import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyAccessToken } from '../token.verifier';

/**
 * Basic 토큰 검증 Guard
 * - userId만 포함된 토큰 검증 (회원가입, 프로필 생성 등)
 * - profileId가 없어도 통과
 */
@Injectable()
export class BasicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as any;

    // 1) Bearer 토큰 추출
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('UNAUTHORIZED: Bearer token required');
    }
    const token = authHeader.slice('Bearer '.length).trim();

    // 2) 서명/만료 검증 + 클레임 추출
    let claims;
    try {
      claims = await verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException('UNAUTHORIZED: invalid or expired token');
    }

    // 3) userId만 확인 (profileId 없어도 OK)
    const userId = claims.sub;
    if (!userId) {
      throw new UnauthorizedException('UNAUTHORIZED: sub(userId) missing');
    }

    // 4) req.auth에 저장
    req.auth = {
      token,
      userId,
      profileId: claims.profileId || null,
      profileType: claims.profileType || null,
      claims,
    };

    return true;
  }
}
