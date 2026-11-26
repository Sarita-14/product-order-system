import { User } from '../../users/entities/user.entity';

/** What POST /auth/login returns inside data. */
export class LoginResponseDto {
  /** Send it on every protected request as  Authorization: Bearer <accessToken> @example "eyJhbGciOiJIUzI1NiIs..." */
  accessToken: string;

  /** The logged-in user (never includes the password) */
  user: User;
}