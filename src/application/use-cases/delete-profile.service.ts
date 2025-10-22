import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { DeleteProfileUseCase } from 'src/application/port/in/delete-profile.use-case';
import { DeleteProfileCommand } from 'src/application/command/delete-profile.command';
import type { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import type { ProfileRepositoryPort } from 'src/application/port/out/profile.repository.port';
import { USER_TOKENS } from '../../user.token';
import { DeleteProfileResult } from '../port/in/result/delete-profile.result';

@Injectable()
export class DeleteProfileService implements DeleteProfileUseCase {
  constructor(
    @Inject(USER_TOKENS.ProfileQueryPort)
    private readonly profileQuery: ProfileQueryPort,

    @Inject(USER_TOKENS.ProfileRepositoryPort)
    private readonly profileRepository: ProfileRepositoryPort,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<DeleteProfileResult> {
    // 1) 프로필 존재 여부 확인
    const profile = await this.profileQuery.findById(command.profileId);
    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    // 2) 프로필이 해당 사용자의 것인지 확인
    if (profile.getUserId() !== command.userId) {
      throw new ForbiddenException('해당 프로필을 삭제할 권한이 없습니다.');
    }

    // 3) 삭제 실행
    await this.profileRepository.delete(command.profileId);

    // 4) 결과 반환
    return {
      profileId: command.profileId,
      deletedAt: new Date().toISOString(),
    };
  }
}
