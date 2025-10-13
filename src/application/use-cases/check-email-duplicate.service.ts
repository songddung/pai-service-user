// src/application/use-cases/check-email-duplicate.service.ts

import { Injectable, Inject } from '@nestjs/common';
import {
  CheckEmailDuplicateUseCase,
  CheckEmailDuplicateResult,
} from 'src/application/port/in/check-email-duplicate.use-case';
import type { UserRepository } from 'src/application/port/out/user.repository';

@Injectable()
export class CheckEmailDuplicateService implements CheckEmailDuplicateUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<CheckEmailDuplicateResult> {
    const exists = await this.userRepository.existsByEmail(email);

    if (exists) {
      return {
        isAvailable: false,
        message: '이미 사용 중인 이메일입니다.',
      };
    }

    return {
      isAvailable: true,
      message: '사용 가능한 이메일입니다.',
    };
  }
}
