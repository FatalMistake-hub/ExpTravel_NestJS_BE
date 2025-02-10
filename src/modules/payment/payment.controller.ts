import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { GuestDto } from '../guest/dto/guest.dto';
import { ResponseDataAPI } from 'src/response/data-api-response';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Payment')
@Controller('payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Process a payment for a tour booking' })
  @ApiParam({ name: 'tour_id', type: Number, description: 'ID of the tour' })
  @ApiParam({
    name: 'time_book_id',
    type: String,
    description: 'ID of the booking time',
  })
  @ApiParam({
    name: 'price_total',
    type: String,
    description: 'Total price of the booking',
  })
  @ApiQuery({
    name: 'language',
    type: String,
    required: false,
    description: 'Language preference',
    example: 'vn',
  })
  @ApiBody({ type: [GuestDto], description: 'List of guest details' })
  @Post(':tour_id/:time_book_id/:price_total')
  async payment(
    @Req() request: Request,
    @Query('language') language: string = 'vn',
    @Param('time_book_id') timeBookId: string,
    @Body() guestDtos: GuestDto[],
    @Param('tour_id') tourId: number,
    @Param('price_total') priceTotal: string,
  ): Promise<ResponseDataAPI> {
    const userId = request.user?.['user_id'];
    const priceTotalNumber = parseFloat(priceTotal);

    return this.paymentService.makePayment(
      userId,
      language,
      timeBookId,
      guestDtos,
      tourId,
      priceTotalNumber,
    );
  }

  @ApiOperation({ summary: 'Handle payment result callback' })
  @ApiQuery({
    name: 'vnp_ResponseCode',
    type: String,
    required: false,
    description: 'Response code from payment gateway',
    example: '00',
  })
  @ApiQuery({
    name: 'vnp_TxnRef',
    type: String,
    required: false,
    description: 'Transaction reference from payment gateway',
  })
  @Get()
  async paymentResult(
    @Query('vnp_ResponseCode') responseCode: string = '00',
    @Query('vnp_TxnRef') txnRef: string = '',
  ): Promise<ResponseDataAPI> {
    return this.paymentService.paymentResult(responseCode, txnRef);
  }
}
