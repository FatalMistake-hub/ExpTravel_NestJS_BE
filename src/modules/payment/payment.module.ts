import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeBookDetailModule } from '../timeBookDetail/timeBookDetail.module';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';
import { PaymentService } from './payment.service';
import { UsersModule } from '../users/users.module';
import { GuestModule } from '../guest/guest.module';
import { NativeWalletRepository } from 'src/repository/wallet.reposity';
import { NativeOrderRepository } from 'src/repository/order.reposity';
import { NativePaymentRepository } from 'src/repository/payment.reposity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, TimeBookDetail]),
    TimeBookDetailModule,
    UsersModule,
    GuestModule,
  ],
  providers: [
    PaymentService,
    NativePaymentRepository,
    NativeOrderRepository,
    NativeWalletRepository,
  ],
  exports: [PaymentService, TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
})
export class PaymentModule {}
