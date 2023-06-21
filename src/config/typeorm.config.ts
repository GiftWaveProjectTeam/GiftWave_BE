// import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();
// const configService = new ConfigService();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: ,
  password: ,
  database: ,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // migrations: ['src/migrations/*.ts'],
  // migrationsTableName: 'migrations',
  synchronize: true,
};
