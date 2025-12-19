import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { SignupUseCase } from 'src/application/port/in/signup.use-case';
import { SignupCommand } from 'src/application/command/signup.command';
import type { UserQueryPort } from 'src/application/port/out/user.query.port';
import type { UserRepositoryPort } from 'src/application/port/out/user.repository.port';
import type { KakaoAddressService } from 'src/application/port/out/kakao-address.service';
import type { RefreshTokenRepositoryPort } from 'src/application/port/out/refresh-token.repository.port';
import type { TokenVersionQueryPort } from 'src/application/port/out/token-version.query.port';
import type { PasswordHasher } from 'src/application/port/out/password-hasher';
import { User } from 'src/domain/model/user/entity/user.entity';
import type { TokenProvider } from 'src/application/port/out/token.provider';
import { USER_TOKENS } from '../../user.token';
import { Email } from 'src/domain/model/user/vo/email.vo';
import { PasswordHash } from 'src/domain/model/user/vo/passwordHash.vo';
import { Address } from 'src/domain/model/user/vo/address.vo';
import { SignupResult } from '../port/in/result/signup.result.dto';

@Injectable()
export class SignupService implements SignupUseCase {
  constructor(
    @Inject(USER_TOKENS.UserQueryPort)
    private readonly userQuery: UserQueryPort,

    @Inject(USER_TOKENS.UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,

    @Inject(USER_TOKENS.KakaoAddressService)
    private readonly kakaoAddressService: KakaoAddressService,

    @Inject(USER_TOKENS.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionQueryPort)
    private readonly tokenVersionQuery: TokenVersionQueryPort,
  ) {}

  async execute(command: SignupCommand): Promise<SignupResult> {
    // 1) 이메일 중복 체크
    const exists = await this.userQuery.existsByEmail(command.email);
    if (exists) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    // 2) 이메일 VO 생성
    const emailVO = Email.create(command.email);

    // 3) 비밀번호 해싱 (Infrastructure 계층의 PasswordHasher 사용)
    const hashedPassword = await this.passwordHasher.hash(command.password);
    const passwordHashVO = PasswordHash.create(hashedPassword);

    // 4) Kakao 주소 → 좌표 변환
    const latLng = await this.kakaoAddressService.getLatLng(command.address);
    if (!latLng) {
      throw new BadRequestException(
        '유효한 주소가 아니거나 좌표를 찾을 수 없습니다.',
      );
    }

    // 5) 주소 VO 생성
    const addressVO = Address.create(
      command.address,
      latLng.latitude,
      latLng.longitude,
    );

    // 6) User 엔티티 생성
    const user = User.create({
      email: emailVO,
      passwordHash: passwordHashVO,
      address: addressVO,
    });

    // 7) 저장 (Prisma)
    const saved = await this.userRepository.save(user);

    // 8) 디바이스별 토큰 버전 조회 (최초 가입이므로 1로 시작)
    const userId = Number(saved.getId());
    const deviceVersion = await this.tokenVersionQuery.getDeviceVersion(
      userId,
      command.deviceId,
    );

    // 9) 토큰 발급
    const tokenPair = await this.tokenProvider.generateBasicTokenPair(
      userId,
      command.deviceId,
      deviceVersion,
    );

    // 10) Redis에 RefreshToken 저장 (7일 TTL)
    await this.refreshTokenRepository.save(
      userId,
      command.deviceId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    return {
      userId: userId,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
