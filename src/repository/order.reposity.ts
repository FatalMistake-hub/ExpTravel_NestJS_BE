import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/order/order.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NativeOrderRepository extends Repository<Order> {
  constructor(private readonly dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async updateStatus(orderId: string, statusOrder: string): Promise<void> {
    const query = `
      UPDATE orders
      SET status_order = $1
      WHERE order_id = $2
    `;
    await this.dataSource.query(query, [statusOrder, orderId]);
  }

  async getOrderByOrderId(orderId: string): Promise<Order | null> {
    const query = `
      SELECT * FROM orders WHERE order_id = $1
    `;
    const result = await this.dataSource.query(query, [orderId]);
    return result.length ? result[0] : null;
  }

  async getOrderByPublicKey(orderIdBlockChain: string, publicKey: string): Promise<Order | null> {
    const query = `
      SELECT * FROM orders 
      WHERE order_id_block_chain = $1 AND public_key = $2
    `;
    const result = await this.dataSource.query(query, [orderIdBlockChain, publicKey]);
    return result.length ? result[0] : null;
  }

  async getListOrderByTourId(tourId: number): Promise<Order[]> {
    const query = `
      SELECT * FROM orders AS o 
      INNER JOIN time_book_details AS tbdt ON tbdt.time_id = o.time_id
      INNER JOIN daybooks AS dbs ON dbs.day_book_id = tbdt.day_book_id
      INNER JOIN tours AS ts ON ts.tour_id = dbs.tour_id
      WHERE ts.tour_id = $1
    `;
    return await this.dataSource.query(query, [tourId]);
  }

  async getOrderByMonth(month: number, userId: string): Promise<Order[]> {
    const query = `
      SELECT * FROM orders 
      WHERE EXTRACT(MONTH FROM created_at) = $1 
      AND user_id = $2
    `;
    return await this.dataSource.query(query, [month, userId]);
  }

  async getListOrderByOwner(userId: string, limit: number, offset: number): Promise<Order[]> {
    const query = `
      SELECT * FROM orders AS o 
      INNER JOIN time_book_details AS tbdt ON tbdt.time_id = o.time_id 
      INNER JOIN daybooks AS dbt ON dbt.day_book_id = tbdt.day_book_id
      INNER JOIN tours AS t ON t.tour_id = dbt.tour_id
      INNER JOIN users AS u ON u.user_id = t.user_id
      WHERE u.role = 'OWNER' AND u.user_id = $1
      LIMIT $2 OFFSET $3
    `;
    return await this.dataSource.query(query, [userId, limit, offset]);
  }

  async calculateRevenueOneDay(day: number, month: number, year: number, userId: string): Promise<number | null> {
    const query = `
      SELECT SUM(price) AS total_revenue
      FROM orders
      WHERE EXTRACT(DAY FROM order_date) = $1 
      AND EXTRACT(MONTH FROM order_date) = $2
      AND EXTRACT(YEAR FROM order_date) = $3 
      AND status_order = 'SUCCESS' 
      AND user_id = $4
    `;
    const result = await this.dataSource.query(query, [day, month, year, userId]);
    return result.length ? result[0].total_revenue : null;
  }

  async calculateOrderCount(day: number, month: number, year: number, userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) AS order_count
      FROM orders
      WHERE EXTRACT(DAY FROM order_date) = $1 
      AND EXTRACT(MONTH FROM order_date) = $2
      AND EXTRACT(YEAR FROM order_date) = $3 
      AND status_order = 'SUCCESS' 
      AND user_id = $4
    `;
    const result = await this.dataSource.query(query, [day, month, year, userId]);
    return result.length ? parseInt(result[0].order_count) : 0;
  }

  async getOrderDetail(userId: string, orderId: string): Promise<Order | null> {
    const query = `
      SELECT * FROM orders AS o 
      INNER JOIN time_book_details AS tbdt ON tbdt.time_id = o.time_id 
      INNER JOIN daybooks AS dbt ON dbt.day_book_id = tbdt.day_book_id
      INNER JOIN tours AS t ON t.tour_id = dbt.tour_id
      INNER JOIN users AS u ON u.user_id = t.user_id
      WHERE u.role = 'OWNER' AND u.user_id = $1 AND o.order_id = $2
    `;
    const result = await this.dataSource.query(query, [userId, orderId]);
    return result.length ? result[0] : null;
  }
}
