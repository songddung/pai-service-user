import { LoginResponseData } from 'pai-shared-types';

export class LoginResponseDto implements LoginResponseData {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
