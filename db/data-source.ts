import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { RefreshToken } from 'src/modules/auth/entity/refresh-token.entity';
import { Category } from 'src/modules/category/category.entity';
import { ImageDetail } from 'src/modules/imageDetail/imageDetail.entity';
import { Tour } from 'src/modules/tour/tour.entity';

import { User } from 'src/modules/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

//LOAD Environment Variables
require('dotenv').config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get<string>('dbHost'),
      port: configService.get<number>('dbPort'),
      username: configService.get<string>('username'),
      // database: configService.get<string>('dbName'),
      database: 'ExpTravel',
      password: configService.get<string>('password'),
      entities: [User, RefreshToken,Tour,Category,ImageDetail],
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
      logging: true,
    };
  },
};
// console.log(process.env.NODE_ENV);
// console.log(process.env.DB_HOST); // these variables are undefined
// console.log(process.env.PASSWORD);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.USERNAME,
  // database: process.env.DB_NAME,
  database: 'ExpTravel',
  password: process.env.PASSWORD,
  entities: ['dist/**/*.entity.js'], //1
  synchronize: false, // 2
  migrations: ['dist/db/migrations/*.js'], // 3
};

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;
