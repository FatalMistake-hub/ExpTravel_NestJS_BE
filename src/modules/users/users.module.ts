import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { NativeUserRepository } from '../../repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, NativeUserRepository],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
})
export class UsersModule {}
