import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class NativeTourService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findTourByCategoryName(
    categoryName: string,
    northEastLat: number,
    southWestLat: number,
    northEastLng: number,
    southWestLng: number,
    offset: number,
    limit: number,
  ) {
    const query = `
      SELECT * FROM tours AS t
      INNER JOIN tour_category as tc ON t.tour_id = tc.tour_id
      INNER JOIN categories AS c ON c.category_id = tc.category_id
      WHERE c.category_name = $1 
        AND t.is_deleted = false
        AND t.latitude BETWEEN $2 AND $3
        AND t.longitude BETWEEN $4 AND $5
      LIMIT $6 OFFSET $7
    `;
    return this.dataSource.query(query, [
      categoryName,
      northEastLat,
      southWestLat,
      northEastLng,
      southWestLng,
      limit,
      offset,
    ]);
  }

  async getAllTourByUserId(userId: string) {
    const query = `
      SELECT * FROM tours
      WHERE tours.user_id = $1 AND tours.is_deleted = false
    `;
    return this.dataSource.query(query, [userId]);
  }

  async getPriceOnePersonByTourId(tourId: number) {
    const query = `
      SELECT price_one_person FROM tours
      WHERE tours.tour_id = $1 AND tours.is_deleted = false
    `;
    return this.dataSource.query(query, [tourId]);
  }

  async getTourByUserId(userId: string, offset: number, limit: number) {
    const query = `
      SELECT * FROM tours
      WHERE tours.user_id = $1 AND tours.is_deleted = false
      LIMIT $2 OFFSET $3
    `;
    return this.dataSource.query(query, [userId, limit, offset]);
  }

  async getAllTour(offset: number, limit: number) {
    const query = `
      SELECT * FROM tours WHERE tours.is_deleted = false
      LIMIT $1 OFFSET $2
    `;
    return this.dataSource.query(query, [limit, offset]);
  }

  async getAllTourForChatGpt() {
    const query = `
      SELECT * FROM tours WHERE tours.is_deleted = false
    `;
    return this.dataSource.query(query);
  }

  async getTourByOrderId(orderId: string) {
    const query = `
      SELECT * FROM tours AS t
      INNER JOIN daybooks AS d ON d.tour_id = t.tour_id
      INNER JOIN time_book_details tbdt ON tbdt.day_book_id = d.day_book_id
      INNER JOIN orders AS o ON o.time_id = tbdt.time_id
      WHERE o.order_id = $1
    `;
    return this.dataSource.query(query, [orderId]);
  }

  async updateStartTimeAndEndTime(
    timeBookStart: string,
    timeBookEnd: string,
    timeSlotLength: number,
    tourId: number,
  ) {
    const query = `
      UPDATE tours
      SET time_book_start = $1, time_book_end = $2, time_slot_length = $3
      WHERE tour_id = $4
    `;
    return this.dataSource.query(query, [
      timeBookStart,
      timeBookEnd,
      timeSlotLength,
      tourId,
    ]);
  }

  async getTourById(tourId: number) {
    const query = `
      SELECT * FROM tours
      WHERE tours.tour_id = $1 AND tours.is_deleted = false
    `;
    return this.dataSource.query(query, [tourId]);
  }

  async getTourViewPort(
    northEastLat: number,
    southWestLat: number,
    northEastLng: number,
    southWestLng: number,
    offset: number,
    limit: number,
  ) {
    const query = `
      SELECT * FROM tours
      WHERE tours.latitude BETWEEN $1 AND $2
        AND tours.longitude BETWEEN $3 AND $4
      LIMIT $5 OFFSET $6
    `;
    return this.dataSource.query(query, [
      northEastLat,
      southWestLat,
      northEastLng,
      southWestLng,
      limit,
      offset,
    ]);
  }
}
