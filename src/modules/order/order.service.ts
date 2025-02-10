import { Injectable, NotFoundException } from '@nestjs/common';
import { NativeDayBookRepository } from 'src/repository/day-book.repository';
import { NativeOrderRepository } from 'src/repository/order.reposity';
import { NativeTimeBookRepository } from 'src/repository/time-book.repository';
import { NativeTourRepository } from 'src/repository/tour.repository';
import { NativeUserRepository } from 'src/repository/user.repository';
import { NativeWalletRepository } from 'src/repository/wallet.reposity';
import { OrderStatusEnum } from 'src/utils/enum';
import { Wallet } from '../wallet/wallet.entity';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { DayBook } from '../dayBook/dayBook.entity';
import { TimeBookViewDto } from '../timeBookDetail/dto/time-book-view.dto';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';
import { Tour } from '../tour/tour.entity';
import { UserViewDto } from '../users/dto/user-view.dto';
import { User } from '../users/user.entity';
import { OrderDetailDto } from './dto/order-detail.dto';
import { OrderResponse } from 'src/response/order-response';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: NativeOrderRepository,
    private readonly walletRepository: NativeWalletRepository,
    private readonly tourRepository: NativeTourRepository,
    private readonly dayBookRepository: NativeDayBookRepository,
    private readonly timeBookRepository: NativeTimeBookRepository,
    private readonly userRepository: NativeUserRepository,
  ) {}

  async requestFromAdmin(status: string, orderId: string): Promise<void> {
    const wallet: Wallet | null =
      await this.walletRepository.getWalletByOrderId(orderId);
    const order: Order | null = await this.orderRepository.getOrderByOrderId(
      orderId,
    );
    if (!wallet || !order) {
      throw new NotFoundException('Wallet or Order not found');
    }
    let totalMoneyUpdate: number;
    if (status === OrderStatusEnum.SUCCESS) {
      await this.orderRepository.updateStatus(OrderStatusEnum.SUCCESS, orderId);
    } else if (status === OrderStatusEnum.CANCEL) {
      totalMoneyUpdate = wallet.total_money + order.price;
      await this.walletRepository.updateTotalMoney(
        wallet.wallet_id,
        totalMoneyUpdate,
      );
      await this.orderRepository.updateStatus(OrderStatusEnum.CANCEL, orderId);
    }
  }

  async getAllOrders(): Promise<OrderDto[]> {
    const orderDtoList: OrderDto[] = [];
    const orderList: Order[] = await this.orderRepository.find();
    let tour: Tour | null = null;
    let dayBook: DayBook | null = null;
    let timeBookViewDto: TimeBookViewDto;
    let timeBookDetail: TimeBookDetail | null = null;
    let user: User | null = null;
    for (const item of orderList) {
      const orderDto = new OrderDto();
      user = await this.userRepository.findOne({
        where: { user_id: item.user_id },
      });;
      tour = await this.tourRepository.getTourByOrderId(item.order_id);
      dayBook = await this.dayBookRepository.getDayBookByTimeId(item.time_id);
      timeBookDetail = await this.timeBookRepository.getTimeBookDetailById(
        item.time_id,
      );

      const userViewDto = new UserViewDto();
      userViewDto.userId = user.user_id;
      userViewDto.role = user.role;
      userViewDto.address = user.address;
      userViewDto.language = user.language;
      userViewDto.userName = user.user_name;
      userViewDto.userEmail = user.user_email;
      userViewDto.urlImage = user.url_image;
      userViewDto.phoneNumber = user.phone_number;

      timeBookViewDto.startTime = timeBookDetail.start_time;
      timeBookViewDto.endTime = timeBookDetail.end_time;
      timeBookViewDto.isDeleted = timeBookDetail.is_deleted;
      timeBookViewDto.timeId = item.time_id;

      orderDto.tourId = tour.tourId;
      orderDto.orderDate = item.created_at;
      orderDto.statusOrder = item.status_order;
      orderDto.price = item.price;
      orderDto.orderIdBlockChain = item.order_id_blockchain;
      orderDto.publicKey = item.public_key;
      orderDto.orderId = item.order_id;
      orderDto.timeId = item.time_id;
      orderDto.userId = item.user_id;
      orderDto.city = tour.city;
      orderDto.date_name = dayBook.date_name;
      orderDto.imageMain = tour.imageMain;
      orderDto.tour_title = tour.title;
      orderDto.priceOnePerson = tour.priceOnePerson;
      orderDto.timeBookViewDto = timeBookViewDto;
      orderDto.user = userViewDto;
      orderDtoList.push(orderDto);
    }
    return orderDtoList;
  }

  async getListOrderByTourId(tourId: number): Promise<OrderDto[]> {
    const orderDtoList: OrderDto[] = [];
    const orderList: Order[] = await this.orderRepository.getListOrderByTourId(
      tourId,
    );
    const tour: Tour | null = await this.tourRepository.getTourById(tourId);
    if (!tour) {
      return orderDtoList;
    }
    for (const item of orderList) {
      const orderDto = new OrderDto();
      orderDto.orderDate = item.created_at;
      orderDto.statusOrder = item.status_order;
      orderDto.price = item.price;
      orderDto.orderId = item.order_id;
      orderDto.timeId = item.time_id;
      orderDto.userId = item.user_id;
      orderDto.city = tour.city;
      orderDto.imageMain = tour.imageMain;
      orderDto.tour_title = tour.title;
      orderDto.orderIdBlockChain = item.order_id_blockchain; 
      orderDto.publicKey = item.public_key; 
      orderDto.priceOnePerson = tour.priceOnePerson;
      orderDtoList.push(orderDto);
    }
    return orderDtoList;
  }

  async getListOrderByOwner(
    userId: string,
    pageNo: number,
    pageSize: number,
  ): Promise<OrderResponse> {
    const orderListOwner = await this.orderRepository.getListOrderByOwner(
      userId,
      (pageNo - 1) * pageSize,
      pageSize,
    );

    let orderRespone: OrderResponse;
    const orderDtoList: OrderDto[] = [];
    let tour: Tour | null = null;
    let dayBook: DayBook | null = null;
    let timeBookViewDto: TimeBookViewDto;
    let timeBookDetail: TimeBookDetail | null = null;
    let user: User | null = null;

    if (orderListOwner) {
      // Check if orderListOwner and data are not null/undefined
      for (const item of orderListOwner) {
        // Cast data to Order[] for type safety
        const orderDto = new OrderDto();
        user = await this.userRepository.findOne({
          where: { user_id: item.user_id },
        });
        tour = await this.tourRepository.getTourByOrderId(item.order_id);
        dayBook = await this.dayBookRepository.getDayBookByTimeId(item.time_id);
        timeBookDetail = await this.timeBookRepository.getTimeBookDetailById(
          item.time_id,
        );

        const userViewDto = new UserViewDto();
        userViewDto.userId = user.user_id;
        userViewDto.role = user.role;
        userViewDto.address = user.address;
        userViewDto.language = user.language;
        userViewDto.userName = user.user_name;
        userViewDto.userEmail = user.user_email;
        userViewDto.urlImage = user.url_image;
        userViewDto.phoneNumber = user.phone_number;

        timeBookViewDto.startTime = timeBookDetail.start_time;
        timeBookViewDto.endTime = timeBookDetail.end_time;
        timeBookViewDto.isDeleted = timeBookDetail.is_deleted;
        timeBookViewDto.timeId = item.time_id;

        orderDto.tourId = tour.tourId;
        orderDto.orderDate = item.created_at;
        orderDto.statusOrder = item.status_order;
        orderDto.price = item.price;
        orderDto.orderIdBlockChain = item.order_id_blockchain;
        orderDto.publicKey = item.public_key;
        orderDto.orderId = item.order_id;
        orderDto.timeId = item.time_id;
        orderDto.userId = item.user_id;
        orderDto.city = tour.city;
        orderDto.date_name = dayBook.date_name;
        orderDto.imageMain = tour.imageMain;
        orderDto.tour_title = tour.title;
        orderDto.priceOnePerson = tour.priceOnePerson;
        orderDto.timeBookViewDto = timeBookViewDto;
        orderDto.user = userViewDto;
        orderDtoList.push(orderDto);
      }
      const totalElements = orderDtoList.length;
      const totalPages = Math.ceil(totalElements / pageSize);
      return {
        content: orderDtoList,
        pageNo: pageNo,
        pageSize: pageSize,
        totalElements: totalElements,
        totalPages: totalPages,
      };
    } else {
      return {
        content: [],
        pageNo: pageNo,
        pageSize: pageSize,
        totalElements: 0,
        totalPages: 0,
      };
    }

    return orderRespone;
  }

  async getOrderDetail(
    order_id: string,
    user_id: string,
  ): Promise<OrderDetailDto> {
    const order: Order = await this.orderRepository.getOrderDetail(
      user_id,
      order_id,
    );
    const tour: Tour = await this.tourRepository.getTourByOrderId(order_id);
    const orderDetailDto = new OrderDetailDto();
    orderDetailDto.orderId = order_id;
    orderDetailDto.orderDate = order.created_at;
    orderDetailDto.statusOrder = order.status_order;
    orderDetailDto.orderIdBlockChain = order.order_id_blockchain;
    orderDetailDto.publicKey = order.public_key;
    orderDetailDto.price = order.price;
    orderDetailDto.city = tour.city;
    orderDetailDto.imageMain = tour.imageMain;
    orderDetailDto.tourTitle = tour.tour_title; // Fix: use tour.tour_title instead of tour.title which may be undefined in DTO
    orderDetailDto.priceOnePerson = tour.priceOnePerson;
    return orderDetailDto;
  }

  async updateOrderByField(id: string, fields: Partial<Order>): Promise<void> {
    const existingOrder: Order | null = await this.orderRepository.getOrderByOrderId(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    for (const key of Object.keys(fields)) {
      if (fields.hasOwnProperty(key)) {
        existingOrder[key] = fields[key]; // Directly assign value using index access
      }
    }
    await this.orderRepository.save(existingOrder);
  }

  async authorizeOrder(
    orderIdBlockchain: string,
    publicKey: string,
  ): Promise<string> {
    const orderOptional: Order = await this.orderRepository.getOrderByPublicKey(
      orderIdBlockchain,
      publicKey,
    );
    if (orderOptional && orderOptional.public_key === publicKey) {
      // Check if orderOptional is not null and then access publicKey
      await this.orderRepository.updateStatus(
        OrderStatusEnum.USED,
        orderOptional.order_id,
      );
      return 'SUCCESS';
    }
    return 'FAIL';
  }
}
