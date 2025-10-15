// src/application/use-cases/check-email-duplicate.service.ts

import { Injectable, Inject } from '@nestjs/common';
import {
  CheckEmailDuplicateUseCase,
  CheckEmailDuplicateResult,
} from 'src/application/port/in/check-email-duplicate.use-case';
import type { UserQueryPort } from 'src/application/port/out/user.query.port';
import { USER_TOKENS } from '../../user.token';

@Injectable()
export class CheckEmailDuplicateService implements CheckEmailDuplicateUseCase {
  constructor(
    @Inject(USER_TOKENS.UserQueryPort)
    private readonly userQuery: UserQueryPort,
  ) {}

  async execute(email: string): Promise<CheckEmailDuplicateResult> {
    const exists = await this.userQuery.existsByEmail(email);

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
