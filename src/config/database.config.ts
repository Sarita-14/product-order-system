import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

/**
 * Single source of truth for DB settings.
 * Used by the Nest app (DatabaseModule) and by the TypeORM CLI (data-source.ts).
 */
export const databaseConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false, // schema changes only through migrations
  logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});