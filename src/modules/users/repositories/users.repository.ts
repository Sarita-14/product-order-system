import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: CreateUserDto & { passwordHash?: string }): Promise<User> {
    const saved = await this.repo.save(this.repo.create(data));
    delete saved.passwordHash; // save() echoes back what we set; never return the hash
    return saved;
  }

  findAll(): Promise<User[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  // Only for login: passwordHash is select:false, so it has to be asked for explicitly
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }
}