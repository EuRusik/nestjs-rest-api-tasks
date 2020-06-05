import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ACCESSES } from '../../accesses.config';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: ACCESSES.DB.HOST,
    port: ACCESSES.DB.PORT,
    username: ACCESSES.DB.USERNAME,
    password: ACCESSES.DB.PASSWORD,
    database: ACCESSES.DB.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
  }
}