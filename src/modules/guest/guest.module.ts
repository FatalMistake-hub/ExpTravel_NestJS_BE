import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestController } from './guest.controller';
import { Guest } from './guest.entity';
import { GuestService } from './guest.service';
import { NativeGuestRepository } from 'src/repository/guest.reposity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  providers: [GuestService, NativeGuestRepository],
  exports: [GuestService, TypeOrmModule.forFeature([Guest])],
  controllers: [GuestController],
})
export class GuestModule {}
