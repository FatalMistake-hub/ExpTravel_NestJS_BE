
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../payment.entity';
import { Order } from 'src/modules/order/order.entity';
import { AutoMap } from '@automapper/classes';

export class PaymentResultDto {
  @AutoMap()
  @ApiProperty({ type: () => Payment })
  payment: Payment;
  
  @AutoMap()
  @ApiProperty({ type: () => Order })
  order: Order;
}
