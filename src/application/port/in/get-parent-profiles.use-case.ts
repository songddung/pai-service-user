import type { GetParentProfilesResponseData } from 'pai-shared-types';

export interface GetParentProfilesQuery {
  userId: number;
}

export interface GetParentProfilesUseCase {
  execute(
    query: GetParentProfilesQuery,
  ): Promise<GetParentProfilesResponseData>;
}
