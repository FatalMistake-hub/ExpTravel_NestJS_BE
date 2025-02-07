import { 
  Controller, 
  Get, 
  Patch, 
  Param, 
  Body, 
  Query, 
  Req, 
  HttpStatus, 
  HttpException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { Request } from 'express';
import { OrderDto } from './dto/order.dto';
import { OrderResponse } from 'src/response/order-response';
import { OrderDetailDto } from './dto/order-detail.dto';
import { OrderService } from './order.service';

@ApiTags('Orders') // Swagger Tag
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of all orders', type: [OrderDto] })
  async getAllOrders(): Promise<OrderDto[]> {
    return this.orderService.getAllOrders();
  }

  @Get('/all/owner')
  @ApiOperation({ summary: 'Get all orders by owner' })
  @ApiQuery({ name: 'pageNo', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 5 })
  async getAllOrdersByOwner(
    @Req() request: Request,
    @Query('pageNo') pageNo: number = 1,
    @Query('pageSize') pageSize: number = 5
  ): Promise<OrderResponse> {
    pageSize = pageSize > 100 ? 100 : pageSize;
    const email = request.user?.['user_email'];
    return this.orderService.getListOrderByOwner(email, pageNo, pageSize);
  }

  @Get('/create-request/:orderId/:status')
  @ApiOperation({ summary: 'Create a request to update order status' })
  @ApiParam({ name: 'orderId', type: String })
  @ApiParam({ name: 'status', type: String })
  async createRequest(
    @Param('orderId') orderId: string, 
    @Param('status') status: string
  ): Promise<string> {
    await this.orderService.requestFromAdmin(status, orderId);
    return 'Success';
  }

  @Patch('/order-update/:id')
  @ApiOperation({ summary: 'Update order fields dynamically' })
  @ApiParam({ name: 'id', type: String })
  async updateOrder(
    @Param('id') id: string, 
    @Body() fields: Record<string, any>
  ): Promise<string> {
    await this.orderService.updateOrderByField(id, fields);
    return 'UPDATE SUCCESS';
  }

  @Get('/authorize-order/:order_id_blockchain/:public_key')
  @ApiOperation({ summary: 'Authorize an order using blockchain ID and public key' })
  @ApiParam({ name: 'order_id_blockchain', type: String })
  @ApiParam({ name: 'public_key', type: String })
  async authorizeOrder(
    @Param('order_id_blockchain') orderIdBlockChain: string, 
    @Param('public_key') publicKey: string
  ): Promise<string> {
    const result = await this.orderService.authorizeOrder(orderIdBlockChain, publicKey);
    return result === 'SUCCESS' ? 'Authorize Success' : 'Authorize Fail';
  }

  @Get('/get-list-order/:tour_id')
  @ApiOperation({ summary: 'Get a list of orders by tour ID' })
  @ApiParam({ name: 'tour_id', type: String })
  async getOrderListByTourId(
    @Param('tour_id') tourId: string
  ): Promise<OrderDto[]> {
    return this.orderService.getListOrderByTourId(Number(tourId));
  }

  @Get('/get-order-detail/:order_id')
  @ApiOperation({ summary: 'Get order details for an owner' })
  @ApiParam({ name: 'order_id', type: String })
  async getOrderDetail(
    @Param('order_id') orderId: string,
    @Req() request: Request
  ): Promise<OrderDetailDto> {
    const email = request.user?.['user_email'];
    return this.orderService.getOrderDetail(orderId, email);
  }
}
