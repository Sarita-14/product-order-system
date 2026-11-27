import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { ChangeUserRoleUseCase } from '../usecases/change-user-role.usecase';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { GetUserUseCase } from '../usecases/get-user.usecase';
import { GetUsersUseCase } from '../usecases/get-users.usecase';
@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly changeUserRoleUseCase: ChangeUserRoleUseCase,
  ) {}

  // Admin: make someone an admin / a customer again (never yourself).
  changeRole(actorId: string, id: string, role: Role): Promise<User> {
    return this.changeUserRoleUseCase.execute(actorId, id, role);
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto);
  }

  findAll(): Promise<User[]> {
    return this.getUsersUseCase.execute();
  }

  findOne(id: string): Promise<User> {
    return this.getUserUseCase.execute(id);
  }
}
