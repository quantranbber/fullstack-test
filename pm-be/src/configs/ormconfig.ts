import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['migrations/**/*{.ts,.js}'],
});
