import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { TimeBookDetail } from 'src/modules/timeBookDetail/timeBookDetail.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NativeTimeBookRepository extends Repository<TimeBookDetail> {
  constructor(private readonly dataSource: DataSource) {
    super(TimeBookDetail, dataSource.createEntityManager());
  }

  // Get all TimeBook details by DayBookId
  async getAllListTimeBookByDayBookId(
    dayBookId: string,
  ): Promise<TimeBookDetail[]> {
    const query = `SELECT * FROM time_book_details AS tbdt WHERE tbdt.day_book_id = $1`;
    return await this.dataSource.query(query, [dayBookId]);
  }

  // Save TimeBook Detail (similar to the native insert statement in SQL)
  async saveTimeBookDetail(
    startTime: string, // use string to store the time as a formatted string
    endTime: string, // use string to store the time as a formatted string
    dayBookId: string,
    isPayment: boolean,
  ): Promise<void> {
    const formattedStartTime = moment(startTime, 'HH:mm').format('HH:mm'); // Format time as string
    const formattedEndTime = moment(endTime, 'HH:mm').format('HH:mm'); // Format time as string

    const query = `
      INSERT INTO public.time_book_details(start_time, end_time, day_book_id, is_payment)
      VALUES ($1, $2, $3, $4)
    `;
    return await this.dataSource.query(query, [
      formattedStartTime,
      formattedEndTime,
      dayBookId,
      isPayment,
    ]);
  }

  // Delete list of TimeBook details by TourId (native delete query)
  async deleteListTimeByTourId(tourId: number): Promise<void> {
    const query = `
      DELETE FROM time_book_details 
      WHERE time_book_details.time_id IN (
        SELECT time_id 
        FROM time_book_details 
        INNER JOIN daybooks 
          ON daybooks.day_book_id = time_book_details.day_book_id 
        INNER JOIN tours 
          ON tours.tour_id = daybooks.tour_id 
        WHERE tours.tour_id = $1
      )
    `;
    this.dataSource.query(query, [tourId]);
  }

  // Get a single TimeBookDetail by TimeBookId
  async getTimeBookDetailById(timeId: string): Promise<TimeBookDetail> {
    const query = `SELECT * FROM time_book_details WHERE time_id = $1`;
    const result = await this.dataSource.query(query, [timeId]);
    return result[0]; // Assuming there will be only one result
  }
}
