import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UUID } from 'uuid';
import { GuestDto } from './dto/guest.dto';
import { GuestService } from './guest.service';

@ApiTags('Guest')
@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a single guest' })
  @ApiResponse({ status: 200, description: 'Guest created successfully' })
  async createGuest(@Body() guestDto: GuestDto): Promise<GuestDto> {
    return await this.guestService.createGuest(guestDto);
  }

  @Post('create-list')
  @ApiOperation({ summary: 'Create multiple guests' })
  @ApiResponse({ status: 200, description: 'Guests created successfully' })
  async createGuestList(@Body() guestDtos: GuestDto[]): Promise<GuestDto[]> {
    return await this.guestService.createGuests(guestDtos);
  }

  @Patch('update-guest/:id')
  @ApiOperation({ summary: 'Update an existing guest' })
  @ApiResponse({ status: 200, description: 'Guest updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateGuest(@Body() guestDto: GuestDto, @Param('id') id: string): Promise<GuestDto> {
    if (!id) {
      throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
    }
    return await this.guestService.updateGuest(guestDto, UUID.parse(id));
  }

  @Delete('guest-delete/:id')
  @ApiOperation({ summary: 'Delete a guest' })
  @ApiResponse({ status: 204, description: 'Guest deleted successfully' })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  async deleteGuest(@Param('id') id: string): Promise<void> {
    await this.guestService.deleteGuestById(UUID.parse(id));
  }
}
