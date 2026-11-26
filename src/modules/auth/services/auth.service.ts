import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginUseCase } from '../usecases/login.usecase';
import { RegisterUseCase } from '../usecases/register.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly usersService: UsersService,
  ) {}

  register(dto: RegisterDto): Promise<User> {
    return this.registerUseCase.execute(dto);
  }

  login(dto: LoginDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  // reuses GetUserUseCase through UsersService (404 if the user was deleted)
  me(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}