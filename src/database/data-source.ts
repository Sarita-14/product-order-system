import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';

// Used only by the TypeORM CLI (migration:generate / run / revert).
export default new DataSource(databaseConfig());