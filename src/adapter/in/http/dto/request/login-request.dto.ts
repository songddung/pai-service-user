import { IsEmail, IsString } from 'class-validator';
import type { LoginRequestDto as ILoginRequestDto } from 'pai-shared-types';

export class LoginRequestDto implements ILoginRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  password: string;
}
