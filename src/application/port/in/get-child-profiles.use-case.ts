import { GetChildProfilesResult } from 'src/adapter/in/http/dto/result/get-profiles.result';

export interface GetChildProfilesQuery {
  userId: number;
}

export interface GetChildProfilesUseCase {
  execute(query: GetChildProfilesQuery): Promise<GetChildProfilesResult>;
}
