import { Injectable } from '@nestjs/common';
import { Guest } from 'src/modules/guest/guest.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NativeGuestRepository extends Repository<Guest>{
  constructor(private readonly dataSource: DataSource) {
    super(Guest, dataSource.createEntityManager());
  }

  async saveGuest(
    guestType: string,
    quantity: number,
    timeId: string,
    userId: string,
  ): Promise<void> {
    const query = `
      INSERT INTO public.guests(guest_type, quantity, time_id, user_id)
      VALUES ($1, $2, $3, $4)
    `;
    await this.dataSource.query(query, [guestType, quantity, timeId, userId]);
  }
}
