import { IsEmail, IsString, MinLength } from 'class-validator';
import { SignupRequestDto as ISignupRequestDto } from 'pai-shared-types';

export class SignupRequestDto implements ISignupRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  address: string;

  @IsString()
  deviceId: string;
}
