import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

// Same fields as creating a user, plus a password.
// Extending CreateUserDto reuses its validation instead of copying it.
export class RegisterDto extends CreateUserDto {
  /** @example "admin123" */
  @IsString()
  @MinLength(6)
  @MaxLength(72) // bcrypt only uses the first 72 bytes
  password: string;
}