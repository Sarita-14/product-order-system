import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // runs after ConfigModule has loaded and validated .env
      useFactory: () => ({ ...databaseConfig(), autoLoadEntities: true }),
    }),
  ],
})
export class DatabaseModule {}
