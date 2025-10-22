import { GetProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';
import { GetProfileCommand } from 'src/application/command/get-profile.command';

export interface GetProfilesUseCase {
  execute(command: GetProfileCommand): Promise<GetProfilesResult>;
}
