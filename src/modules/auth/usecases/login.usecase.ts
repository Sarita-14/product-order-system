// ─────────────────────────────────────────────────────────────────────────────
// FILE: login.usecase.ts — checks email + password and creates the token.
//
// CONCEPT — "use case": one class = one business action ("log in").
//   It holds the rules; it gets data through a REPOSITORY (database access).
//
// DATA COMES FROM: the JSON body of POST /auth/login (email, password),
//   and the users table (through UsersRepository).
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it. UnauthorizedException = a 401 error.
import { Injectable, UnauthorizedException } from '@nestjs/common';
// JwtService = creates (signs) tokens with JWT_SECRET.
import { JwtService } from '@nestjs/jwt';
// compare = checks a typed password against the stored bcrypt hash.
import { compare } from 'bcryptjs';
// Database access for users.
import { UsersRepository } from '../../users/repositories/users.repository';
// The shape of the login body: { email, password }.
import { LoginDto } from '../dto/login.dto';
// The shape of the answer: { accessToken, user }.
import { LoginResponseDto } from '../dto/login-response.dto';
// The shape of what we put inside the token.
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class LoginUseCase {
  // Nest hands us the repository and the token service ready to use (we never create them ourselves).
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  // execute = do the action. "{ email, password }: LoginDto" takes the two fields out of the body.
  async execute({ email, password }: LoginDto): Promise<LoginResponseDto> {
    // Find the user by email, INCLUDING the password hash (normally hidden).
    const user = await this.usersRepository.findByEmailWithPassword(email);

    // Same message for "no such email" and "wrong password",
    // so nobody can use the login form to find out which emails exist.
    // "!!user?.passwordHash" = true only if the user exists AND has a password;
    // "&&" = only then run compare(). valid ends up true or false.
    const valid =
      !!user?.passwordHash && (await compare(password, user.passwordHash));
    // No user, or wrong password -> 401.
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Build what goes INSIDE the token (see jwt-payload.interface.ts).
    const payload: JwtPayload = {
      sub: user.id, // who
      email: user.email,
      username: user.username,
      role: user.role, // customer or admin -> RolesGuard reads it later
    };
    delete user.passwordHash; // don't send the hash back
    // signAsync = create the signed token text. Return it together with the user.
    return { accessToken: await this.jwtService.signAsync(payload), user };
  }
}
