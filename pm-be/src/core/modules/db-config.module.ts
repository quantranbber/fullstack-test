import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as repositories from '@repositories/index';
import * as path from 'path';
import { TypeOrmCustomModule } from './typeorm-custom.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      entities: [path.join(__dirname, '../../entities/**/*.entity{.ts,.js}')],
      // synchronize: true,
      autoLoadEntities: true,
      logging: ['query', 'error'],
    }),
    TypeOrmCustomModule.forFeature(Object.values(repositories)),
  ],
  exports: [TypeOrmModule, TypeOrmCustomModule],
})
export class DbConfigModule {}
