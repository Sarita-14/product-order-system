import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { GetUserUseCase } from './usecases/get-user.usecase';
import { GetUsersUseCase } from './usecases/get-users.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserUseCase,
  ],
  // UsersService: PlaceOrderUseCase finds the customer; UsersRepository: auth usecases
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}