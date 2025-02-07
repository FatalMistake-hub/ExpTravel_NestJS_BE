import { Injectable } from '@nestjs/common';
import { Payment } from 'src/modules/payment/payment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NativePaymentRepository extends Repository<Payment>{
  constructor(private readonly dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }

  async findByTxnRef(txnRef: string): Promise<Payment | null> {
    return this.dataSource.query(`SELECT * FROM payments WHERE txn_ref = $1`, [txnRef]);
  }
}
