import { GetProfileCommand } from 'src/application/command/get-profile.command';
import { GetProfilesResult } from './result/get-profiles.result';

export interface GetProfilesUseCase {
  execute(command: GetProfileCommand): Promise<GetProfilesResult>;
}
