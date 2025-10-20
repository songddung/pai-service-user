import { DeleteProfileResponseData } from 'pai-shared-types';

export class DeleteProfileResponseDto implements DeleteProfileResponseData {
  profileId: string;
  deletedAt: string;
}
