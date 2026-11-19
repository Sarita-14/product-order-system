import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { GetUserUseCase } from '../usecases/get-user.usecase';
import { GetUsersUseCase } from '../usecases/get-users.usecase';
@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

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
