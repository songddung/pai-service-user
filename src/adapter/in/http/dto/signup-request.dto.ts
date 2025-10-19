import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  address: string;
}
