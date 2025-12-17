import { GetProfileIdCommand } from 'src/application/command/get-profileId.command';
import { GetProfileIdResult } from './result/get-profileId.result';

export interface GetProfileIdUseCase {
  execute(command: GetProfileIdCommand): Promise<GetProfileIdResult>;
}
