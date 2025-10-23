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
import type { TokenVersionRepositoryPort } from 'src/application/port/out/token-version.repository.port';
import { User } from 'src/domain/model/user/entity/user.entity';
import type { TokenProvider } from 'src/application/port/out/token.provider';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { USER_TOKENS } from '../../user.token';
import { SignupResponseVO } from 'src/domain/model/user/vo/signup-response.vo';

@Injectable()
export class SignupService implements SignupUseCase {
  constructor(
    @Inject(USER_TOKENS.UserQueryPort)
    private readonly userQuery: UserQueryPort,

    @Inject(USER_TOKENS.UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,

    @Inject(USER_TOKENS.KakaoAddressService)
    private readonly kakaoAddressService: KakaoAddressService,

    @Inject(USER_TOKENS.TokenProvider)
    private readonly tokenProvider: TokenProvider,

    @Inject(USER_TOKENS.RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,

    @Inject(USER_TOKENS.TokenVersionRepositoryPort)
    private readonly tokenVersionRepository: TokenVersionRepositoryPort,

    private readonly configService: ConfigService,
  ) {}

  async execute(command: SignupCommand): Promise<SignupResponseVO> {
    // 1) 이메일 중복 체크
    const exists = await this.userQuery.existsByEmail(command.email);
    if (exists) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    // 2) 비밀번호 해싱 (saltRounds = .env)
    const saltRoundsStr = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const saltRounds = saltRoundsStr ? parseInt(saltRoundsStr, 10) : 12;
    const passwordHash = await bcrypt.hash(command.password, saltRounds);

    // 3) User 엔티티 생성 (위/경도는 null 상태)
    const user = User.create({
      email: command.email,
      passwordHash,
      address: command.address,
    });

    // 4) Kakao 주소 → 좌표 변환
    const latLng = await this.kakaoAddressService.getLatLng(command.address);

    if (!latLng) {
      throw new BadRequestException('주소를 기반으로 좌표를 찾을 수 없습니다.');
    }

    // 5) 엔티티에 주소 + 위경도 반영
    user.changeAddress(command.address, latLng.latitude, latLng.longitude);

    // 6) 저장 (Prisma)
    const saved = await this.userRepository.save(user);

    // 7) 토큰 버전 증가 (최초 가입이므로 1부터 시작)
    const userId = Number(saved.getId());
    const tokenVersion =
      await this.tokenVersionRepository.incrementVersion(userId);

    // 8) 토큰 발급
    const tokenPair = await this.tokenProvider.generateBasicTokenPair(
      userId,
      tokenVersion,
    );

    // 9) Redis에 RefreshToken 저장 (7일 TTL)
    await this.refreshTokenRepository.save(
      userId,
      tokenPair.refreshToken,
      7 * 24 * 60 * 60, // 7일 (초 단위)
    );

    return SignupResponseVO.create(
      userId,
      tokenPair.accessToken,
      tokenPair.refreshToken,
    );
  }
}
