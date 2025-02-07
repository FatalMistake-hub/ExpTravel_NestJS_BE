import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { NativeUserRepository } from 'src/repository/user.repository';
import { UUID } from 'uuid';
import { WalletDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('wallet')
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly userRepository: NativeUserRepository,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post('create')
  async createWallet(
    @Body() walletDto: WalletDto,
    @Req() request: Request,
  ): Promise<string> {
    const email = request.user?.['user_email'];
    const userId = request.user?.['user_id'];
    const user = await this.userRepository.getUserByUserEmail(email);
    user.isWallet = true;
    await this.userRepository.save(user);
    await this.walletService.createWallet(walletDto, userId);
    return 'Create Success';
  }

  @ApiOperation({ summary: 'Retrieve user wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Wallet not found.' })
  @Get('get-wallet')
  async getWallet(@Req() request: Request): Promise<WalletDto> {
    const email = request.user?.['user_email'];
    const userId = request.user?.['user_id'];
    const user = await this.userRepository.getUserByUserEmail(email);
    return this.walletService.getWalletByUserId(userId);
  }

  @ApiOperation({ summary: 'Update wallet by ID' })
  @ApiResponse({ status: 200, description: 'Wallet updated successfully.' })
  @ApiResponse({ status: 404, description: 'Wallet not found.' })
  @Patch('wallet-update/:id')
  async updateWallet(
    @Param('id') id: string,
    @Body() fields: Record<string, any>,
  ): Promise<string> {
    await this.walletService.updateWalletByField(UUID.parse(id), fields);
    return 'UPDATE SUCCESS';
  }
}
