import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../port/in/login.use-case';
import type { UserRepository } from '../port/out/user.repository';
import type { TokenProvider } from '../port/out/token.provider';
import { LoginResponseData } from 'pai-shared-types';
import * as bcrypt from 'bcrypt';
import { LoginCommand } from '../command/login.command';

@Injectable()
export class LoginService implements LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('TokenProvider')
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseData> {
    // 사용자 조회
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(
      command.password,
      user.getPasswordHash(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 토큰 발급
    const tokenPair = await this.tokenProvider.generateBasicTokenPair(
      Number(user.getId()),
    );

    return {
      userId: Number(user.getId()),
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
