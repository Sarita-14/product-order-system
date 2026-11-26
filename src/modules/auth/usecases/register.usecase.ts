import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { UsersRepository } from '../../users/repositories/users.repository';
import { RegisterDto } from '../dto/register.dto';

const SALT_ROUNDS = 10; // cost of hashing: higher = slower = harder to brute-force

@Injectable()
export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ password, ...user }: RegisterDto): Promise<User> {
    const passwordHash = await hash(password, SALT_ROUNDS);
    // duplicate username/email/phone -> Postgres 23505 -> 409 via AllExceptionsFilter
    return this.usersRepository.create({ ...user, passwordHash });
  }
}