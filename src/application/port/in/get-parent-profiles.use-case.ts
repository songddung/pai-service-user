import { GetParentProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';

export interface GetParentProfilesQuery {
  userId: number;
}

export interface GetParentProfilesUseCase {
  execute(query: GetParentProfilesQuery): Promise<GetParentProfilesResult>;
}
