import type { LogoutCommand } from 'src/application/command/logout.command';

export interface LogoutUseCase {
  execute(command: LogoutCommand): Promise<void>;
}
