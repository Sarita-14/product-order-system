import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersRepository } from '../../users/repositories/users.repository';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findByEmailWithPassword(email);

    // Same message for "no such email" and "wrong password",
    // so nobody can use the login form to find out which emails exist.
    const valid =
      !!user?.passwordHash && (await compare(password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    delete user.passwordHash; // don't send the hash back
    return { accessToken: await this.jwtService.signAsync(payload), user };
  }
}