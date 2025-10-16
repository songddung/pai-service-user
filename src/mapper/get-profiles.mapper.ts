import { Injectable } from '@nestjs/common';

/**
 * GetProfiles 관련 Query 변환 담당
 */
@Injectable()
export class GetProfilesMapper {
  toQuery(userId: number): { userId: number } {
    return { userId };
  }
}
