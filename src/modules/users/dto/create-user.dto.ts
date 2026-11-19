import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  /** @example "anjali" */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  /** @example "anjali@example.com" */
  @IsEmail()
  @MaxLength(255)
  email: string;

  /** @example "9876543210" */
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber: string;
}
