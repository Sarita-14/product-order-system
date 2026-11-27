// FIRST: run in UTC, like the app (see config/timezone.ts).
import '../config/timezone';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';

export default new DataSource(databaseConfig());
