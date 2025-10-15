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
import { User } from 'src/domain/model/user/user.entity';
import type { TokenProvider } from 'src/application/port/out/token.provider';
import { SignupResponseData } from 'pai-shared-types';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { USER_TOKENS } from '../../user.token';

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

    private readonly configService: ConfigService,
  ) {}

  async execute(command: SignupCommand): Promise<SignupResponseData> {
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

    // 7) 토큰 발급
    const tokenPair = await this.tokenProvider.generateBasicTokenPair(
      Number(saved.getId()),
    );

    // 8) 반환 DTO 구성
    const response: SignupResponseData = {
      userId: Number(saved.getId()),
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };

    return response;
  }
}
