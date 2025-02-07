import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestDto } from './dto/guest.dto';
import { v4 as uuidv4 } from 'uuid';
import { Guest } from './guest.entity';
import { NativeGuestRepository } from 'src/repository/guest.reposity';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private readonly nativeGuestRepository: NativeGuestRepository,
  ) {}

  async createGuests(guestDtos: GuestDto[]): Promise<GuestDto[]> {
    for (const guestDto of guestDtos) {
      const guest = this.nativeGuestRepository.create({
        // guestId: uuidv4(),
        ...guestDto,
      });
      await this.nativeGuestRepository.save(guest);
    }
    return guestDtos;
  }

  async createGuest(guestDto: GuestDto): Promise<GuestDto> {
    const guest = this.nativeGuestRepository.create({
      guestId: uuidv4(),
      ...guestDto,
    });
    await this.nativeGuestRepository.save(guest);
    return guestDto;
  }

  async deleteGuestById(id: string): Promise<void> {
    const guest = await this.nativeGuestRepository.findOne({ where: { guestId: id } });
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    await this.nativeGuestRepository.delete(id);
  }

  async updateGuest(guestDto: GuestDto, id: string): Promise<GuestDto> {
    const guest = await this.nativeGuestRepository.findOne({ where: { guestId: id } });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    await this.nativeGuestRepository.saveGuest(guestDto.guestType, guestDto.quantity, guestDto.timeId, guestDto.userId);

    return { ...guest, ...guestDto };
  }

  async getAllGuests(): Promise<GuestDto[]> {
    const guests = await this.nativeGuestRepository.find();
    return guests.map((guest) => ({
      guestId: guest.guestId,
      guestType: guest.guestType,
      quantity: guest.quantity,
      timeId: guest.timeId,
      userId: guest.userId,
    }));
  }
}
