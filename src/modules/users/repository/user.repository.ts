import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class NativeUserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getUserByTourId(tourId: number) {
    const query = `
      SELECT * FROM users
      INNER JOIN tours
        ON users."userId" = tours.user_id
      WHERE tours.tour_id = $1
    `;
    return await this.dataSource.query(query, [tourId]);
  }
}
