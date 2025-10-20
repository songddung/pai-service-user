import { LoginResponseData } from 'pai-shared-types';

export class SignupResponseDto implements LoginResponseData {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
