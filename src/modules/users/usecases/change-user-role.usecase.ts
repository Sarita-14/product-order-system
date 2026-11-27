// ─────────────────────────────────────────────────────────────────────────────
// FILE: change-user-role.usecase.ts — an admin makes someone an admin, or a customer again.
// Rules: the user must exist (404), and nobody may change their OWN role (400),
// so an admin can never lock themselves out by accident.
// The change works at once: JwtAuthGuard reads every user's role fresh from the database.
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error.
import { BadRequestException, Injectable } from '@nestjs/common';
// The User entity (return type).
import { User } from '../entities/user.entity';
// The list of roles.
import { Role } from '../enums/role.enum';
// Database access for users.
import { UsersRepository } from '../repositories/users.repository';
// Reused: load a user, or 404.
import { GetUserUseCase } from './get-user.usecase';

@Injectable()
export class ChangeUserRoleUseCase {
  // Nest hands us the helpers ready to use.
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}

  // actorId = the admin doing it (from the token); id = whose role changes; role = the new role.
  async execute(actorId: string, id: string, role: Role): Promise<User> {
    if (actorId === id) {
      throw new BadRequestException('You cannot change your own role');
    }
    const user = await this.getUserUseCase.execute(id); // 404 if missing
    if (user.role === role) return user; // already that role -> nothing to do
    await this.usersRepository.updateRole(id, role);
    return this.getUserUseCase.execute(id); // load again so the answer shows the new role
  }
}
