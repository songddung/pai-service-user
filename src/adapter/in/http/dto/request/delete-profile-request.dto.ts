import { IsString } from 'class-validator';
import { DeleteProfileRequestDto as IDeleteProfileRequestDto } from 'pai-shared-types';

export class DeleteProfileRequestDto implements IDeleteProfileRequestDto {
  @IsString()
  profileId: string;
}
