import { Injectable } from '@nestjs/common';
import { LogoutCommand } from '../application/command/logout.command';

/**
 * DTO(shared-type) <-> Command <-> Response 변환 담당
 */
@Injectable()
export class LogoutMapper {
  toCommand(userId: number): LogoutCommand {
    return new LogoutCommand(userId);
  }
}
