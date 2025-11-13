import { DataSource } from 'typeorm';
import { Note } from '../entities/Note';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'pass',
  database: process.env.DB_NAME || 'notes',
  entities: [Note],
  synchronize: true,
  logging: true,
  entitySkipConstructor: false,
});