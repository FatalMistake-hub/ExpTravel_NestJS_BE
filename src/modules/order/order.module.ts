import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { NativeOrderRepository } from 'src/repository/order.reposity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NativeDayBookRepository } from 'src/repository/day-book.repository';
import { NativeTimeBookRepository } from 'src/repository/time-book.repository';
import { NativeTourRepository } from 'src/repository/tour.repository';
import { NativeUserRepository } from 'src/repository/user.repository';
import { NativeWalletRepository } from 'src/repository/wallet.reposity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [
    OrderService,
    NativeOrderRepository,
    NativeWalletRepository,
    NativeTourRepository,
    NativeDayBookRepository,
    NativeTimeBookRepository,
    NativeUserRepository,
  ],
  exports: [OrderService, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
})
export class OrderModule {}
