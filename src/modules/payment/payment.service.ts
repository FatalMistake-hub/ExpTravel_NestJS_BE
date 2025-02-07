import { Injectable, NotFoundException } from '@nestjs/common';

import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { TimeBookDetailService } from '../timeBookDetail/timeBookDetail.service';
import { GuestDto } from '../guest/dto/guest.dto';
import { ResponseDataAPI } from 'src/response/data-api-response';
import { OrderStatusEnum, PaymentStatus } from 'src/utils/enum';
import { Payment } from './payment.entity';
import { Wallet } from '../wallet/wallet.entity';
import { NativeWalletRepository } from 'src/repository/wallet.reposity';
import { Order } from '../order/order.entity';
import { NativeOrderRepository } from 'src/repository/order.reposity';
import { GuestService } from '../guest/guest.service';
import { NativePaymentRepository } from 'src/repository/payment.reposity';
import { PaymentResultDto } from './dto/payment-result.dto';
import { Common } from 'src/common/constants/vnpay';

@Injectable()
export class PaymentService {
  constructor(
    private readonly nativePaymentRepository: NativePaymentRepository,
    private readonly userService: UsersService,
    private readonly timeBookDetailService: TimeBookDetailService,
    private readonly nativeOrderRepository: NativeOrderRepository,
    private readonly nativeWalletRepository: NativeWalletRepository,
    private readonly guestService: GuestService,
  ) {}

  async makePayment(
    userId: string,
    language: string,
    timeId: string,
    guestDtos: GuestDto[],
    tourId: number,
    priceTotal: number,
  ): Promise<ResponseDataAPI> {
    // 1. Lấy thông tin TimeBookDetail và kiểm tra đã thanh toán chưa
    const timeBook = await this.timeBookDetailService.getTimeBookDetailById(timeId);
    if (timeBook.is_payment) {
      throw new NotFoundException('PAYMENT NOT FOUND');
    }
    const returnUrl = 'https://experience-travel.vercel.app/trips';

    // 2. Thiết lập các thuộc tính của VNPAY
    const vnp_Version = '2.1.0';
    const vnp_Command = 'pay';
    // Tạo vnp_TxnRef với 8 chữ số (sử dụng random, có thể dùng crypto.randomInt nếu cần bảo mật cao)
    const vnp_TxnRef = (Math.floor(Math.random() * 100000000))
      .toString()
      .padStart(8, '0');
    const vnp_IpAddr = '127.0.0.1';
    const vnp_TmnCode = Common.VNP_CODE; 
    const vnp_OrderInfo = 'PAYMENT TOUR';
    const orderType = 'other';
    const locate = language;

    const amount = priceTotal;
    console.log('amount: ', amount);

    // 3. Tạo danh sách guest (mỗi guest có guestId mới)
    const guestDtoList: GuestDto[] = guestDtos.map(item => ({
      guestType: item.guestType,
      quantity: item.quantity,
      timeId,
      userId,
    }));
    console.log('Guest List size: ', guestDtoList.length);
    await this.guestService.createGuests(guestDtoList);

    // 4. Tạo Order mới
    const order = new Order();
    order.orderDate = new Date();
    order.statusOrder = OrderStatusEnum.WAITING;
    order.timeId = timeId;
    order.userId = userId;
    order.price = priceTotal;
 
    const savedOrder = await this.nativeOrderRepository.save(order);

    // 5. Xây dựng tham số VNPAY
    const vnp_Params: Record<string, string> = {
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_Amount: Math.floor(amount).toString(),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: savedOrder.orderId.toString(),
      vnp_OrderInfo,
      vnp_OrderType: orderType,
      vnp_Locale: locate,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr,
    };

    // 6. Thiết lập thời gian theo múi giờ GMT+7
    const currentTime = new Date();
    // Tính GMT+7 (7 giờ * 60 phút)
    const offset = 7 * 60;
    const gmt7Time = new Date(currentTime.getTime() + offset * 60000);

    const formatDate = (date: Date): string => {
      const yyyy = date.getFullYear().toString();
      const MM = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      const HH = date.getHours().toString().padStart(2, '0');
      const mm = date.getMinutes().toString().padStart(2, '0');
      const ss = date.getSeconds().toString().padStart(2, '0');
      return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
    };

    const vnp_CreateDate = formatDate(gmt7Time);
    vnp_Params['vnp_CreateDate'] = vnp_CreateDate;

    // Thêm 30 phút cho thời gian hết hạn
    const expireTime = new Date(gmt7Time.getTime() + 30 * 60000);
    const vnp_ExpireDate = formatDate(expireTime);
    vnp_Params['vnp_ExpireDate'] = vnp_ExpireDate;

    // 7. Sắp xếp các key, xây dựng chuỗi hashData và query string
    const sortedKeys = Object.keys(vnp_Params).sort();
    let hashData = '';
    let query = '';
    sortedKeys.forEach((key, index) => {
      const value = vnp_Params[key];
      if (value && value.length > 0) {
        hashData += `${key}=${encodeURIComponent(value)}`;
        query += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        if (index < sortedKeys.length - 1) {
          hashData += '&';
          query += '&';
        }
      }
    });

    // 8. Tính toán vnp_SecureHash bằng HMAC SHA512
    const vnp_HashSecret = Common.VNP_HASH_SECRET;
    const vnp_SecureHash = crypto
      .createHmac('sha512', vnp_HashSecret)
      .update(hashData)
      .digest('hex');
    query += `&vnp_SecureHash=${vnp_SecureHash}`;
    const paymentUrl = `${Common.VNP_URL}?${query}`;

    // 9. Cập nhật ví: trừ số tiền thanh toán khỏi tổng tiền
    const wallet: Wallet = await this.nativeWalletRepository.getWalletByOrderId(savedOrder.orderId);
    wallet.totalMoney = wallet.totalMoney - priceTotal;
    await this.nativeWalletRepository.save(wallet);

    // 10. Tạo Payment mới
    const payment = new Payment();
    payment.created_at = new Date();
    payment.vnpOrderInfo = vnp_OrderInfo;
    payment.orderType = orderType;
    payment.amount = amount;
    payment.locate = locate;
    payment.ipAddress = vnp_IpAddr;
    payment.paymentUrl = paymentUrl;
    payment.status = PaymentStatus.SUCCESS;
    payment.txnRef = savedOrder.orderId.toString();
    payment.timeOver = expireTime;
    payment.userId = userId;
    payment.user = await this.userService.findOneById(userId);
    payment.timeId = timeId;
    payment.timeBookDetail = timeBook;
    await this.nativePaymentRepository.save(payment);

    // 11. Tạo PaymentResultDto và trả về kết quả
    const paymentResultDto = new PaymentResultDto();
    paymentResultDto.payment = payment;
    paymentResultDto.order = savedOrder;
    return ResponseDataAPI.successWithoutMeta(paymentResultDto);
  }

  async findByTxnRef(txnRef: string): Promise<Payment> {
    const payment = await this.nativePaymentRepository.findByTxnRef(txnRef);
    if (!payment) {
      throw new NotFoundException('PAYMENT NOT FOUND');
    }
    return payment;
  }

  async paymentResult(responseCode: string, txnRef: string): Promise<ResponseDataAPI> {
    const payment = await this.findByTxnRef(txnRef);
    if (responseCode === '00') {
      payment.status = PaymentStatus.SUCCESS;
      payment.updated_at = new Date();
      const timeBookDetail = await this.timeBookDetailService.updateStatusPayment(payment.timeBookDetail.time_id, true);
    } else {
      payment.status = PaymentStatus.FAILURE;
      payment.updated_at = new Date();
    }
    const result = await this.nativePaymentRepository.save(payment);
    return ResponseDataAPI.successWithoutMeta(result);
  }
}
