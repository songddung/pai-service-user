import type { GetChildProfilesResponseData } from 'pai-shared-types';

export interface GetChildProfilesQuery {
  userId: number;
}

export interface GetChildProfilesUseCase {
  execute(query: GetChildProfilesQuery): Promise<GetChildProfilesResponseData>;
}
