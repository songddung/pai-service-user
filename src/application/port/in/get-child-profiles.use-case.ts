import { GetProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';
import { GetProfileCommand } from 'src/application/command/get-profile.command';

export interface GetChildProfilesUseCase {
  execute(command: GetProfileCommand): Promise<GetProfilesResult>;
}
