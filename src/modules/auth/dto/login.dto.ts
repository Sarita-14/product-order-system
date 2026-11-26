import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** @example "anjali@example.com" */
  @IsEmail()
  email: string;

  /** @example "admin123" */
  @IsString()
  @IsNotEmpty()
  password: string;
}