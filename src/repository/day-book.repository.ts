import { Injectable } from '@nestjs/common';
import { DayBook } from 'src/modules/dayBook/dayBook.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NativeDayBookRepository extends Repository<DayBook> {
  constructor(private readonly dataSource: DataSource) {
    super(DayBook, dataSource.createEntityManager());
  }

  async getDayBookByTourIdPaging(
    tourId: number,
    start: Date,
    end: Date,
    page: number,
    pageSize: number,
  ) {
    const offset = page * pageSize;
    const query = `
      SELECT * 
      FROM daybooks 
      WHERE tour_id = $1 AND date_name BETWEEN $2 AND $3
      LIMIT $4 OFFSET $5
    `;
    return await this.dataSource.query(query, [tourId, start, end, pageSize, offset]);
  }

  async getDayBookByTourId(tourId: number) {
    const query = `
      SELECT * 
      FROM daybooks 
      WHERE tour_id = $1
    `;
    return await this.dataSource.query(query, [tourId]);
  }

  async getDayBookByTourIdPageable(
    tourId: number,
    page: number,
    pageSize: number,
  ) {
    const offset = page * pageSize;
    const query = `
      SELECT * 
      FROM daybooks 
      WHERE tour_id = $1
      LIMIT $2 OFFSET $3
    `;
    return await this.dataSource.query(query, [tourId, pageSize, offset]);
  }

  async getDayBookByTimeId(timeId: string) {
    const query = `
      SELECT * 
      FROM daybooks db
      INNER JOIN time_book_details tbd
        ON tbd.day_book_id = db.day_book_id
      WHERE tbd.time_id = $1
    `;
    return await this.dataSource.query(query, [timeId]);
  }
}
